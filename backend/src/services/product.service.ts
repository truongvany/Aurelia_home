import { Types } from "mongoose";
import { CategoryModel } from "../models/category.model.js";
import { ProductImageModel } from "../models/productImage.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { ApiError } from "../utils/ApiError.js";

interface ProductQuery {
  category?: string;
  size?: string;
  color?: string;
  q?: string;
}

interface MegaMenuItem {
  name: string;
  slug: string;
  isHighlight?: boolean;
  description?: string;
  productCount?: number;
}

interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

const MENU_TITLE_ORDER = ["SẢN PHẨM ƯU ĐÃI", "ÁO", "QUẦN", "PHỤ KIỆN", "DANH MỤC KHÁC"];

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const toMenuTitle = (name: string, slug: string): string => {
  const normalizedName = normalizeText(name);
  const normalizedSlug = normalizeText(slug);

  if (
    normalizedName.includes("uu dai") ||
    normalizedName.includes("sale") ||
    normalizedSlug.includes("uu-dai") ||
    normalizedSlug.includes("sale")
  ) {
    return "SẢN PHẨM ƯU ĐÃI";
  }

  if (
    normalizedName.includes("ao") ||
    normalizedSlug.includes("shirt") ||
    normalizedSlug.includes("wear")
  ) {
    return "ÁO";
  }

  if (normalizedName.includes("quan") || normalizedSlug.includes("trouser") || normalizedSlug.includes("jean")) {
    return "QUẦN";
  }

  if (
    normalizedName.includes("phu kien") ||
    normalizedName.includes("giay") ||
    normalizedSlug.includes("accessor") ||
    normalizedSlug.includes("footwear")
  ) {
    return "PHỤ KIỆN";
  }

  return "DANH MỤC KHÁC";
};

export const listCategories = async () => {
  const childCategories = await CategoryModel.find({ parentId: { $ne: null } }).sort({ name: 1 });
  if (childCategories.length > 0) {
    return childCategories;
  }

  return CategoryModel.find().sort({ name: 1 });
};

export const getMegaMenu = async () => {
  const [categories, categoryCounts] = await Promise.all([
    CategoryModel.find().sort({ name: 1 }).lean(),
    ProductModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { isActive: true } },
      { $group: { _id: "$categoryId", count: { $sum: 1 } } }
    ])
  ]);

  const countMap = new Map(categoryCounts.map((entry) => [entry._id.toString(), entry.count]));
  type CategoryNode = (typeof categories)[number];

  const childrenByParent = new Map<string, CategoryNode[]>();
  const roots = categories.filter((category) => !category.parentId);

  for (const category of categories) {
    if (!category.parentId) {
      continue;
    }

    const parentKey = category.parentId.toString();
    const current = childrenByParent.get(parentKey) ?? [];
    current.push(category);
    childrenByParent.set(parentKey, current);
  }

  const hasHierarchy = roots.some((root) => (childrenByParent.get(root._id.toString()) ?? []).length > 0);

  if (hasHierarchy) {
    const hierarchyColumns: MegaMenuColumn[] = roots
      .map((root) => {
        const title = toMenuTitle(root.name, root.slug);
        const children = (childrenByParent.get(root._id.toString()) ?? []).sort((a, b) => a.name.localeCompare(b.name));

        const items = children.map((child) => {
          const productCount = countMap.get(child._id.toString()) ?? 0;
          return {
            name: child.name,
            slug: child.slug,
            description: child.description,
            productCount,
            isHighlight: productCount > 0
          };
        });

        if (title === "SẢN PHẨM ƯU ĐÃI") {
          items.unshift({
            name: "Sản Phẩm Giảm Giá",
            slug: "sale",
            description: "Sản phẩm ưu đãi giảm giá",
            productCount: 99,
            isHighlight: true
          });
        }

        return {
          title,
          items
        };
      })
      .filter((column) => column.items.length > 0)
      .sort((a, b) => MENU_TITLE_ORDER.indexOf(a.title) - MENU_TITLE_ORDER.indexOf(b.title));

    return hierarchyColumns;
  }

  const groupedColumns = new Map<string, MegaMenuItem[]>();

  for (const category of categories) {
    const productCount = countMap.get(category._id.toString()) ?? 0;
    const groupTitle = toMenuTitle(category.name, category.slug);
    const current = groupedColumns.get(groupTitle) ?? [];

    current.push({
      name: category.name,
      slug: category.slug,
      description: category.description,
      isHighlight: productCount > 0,
      productCount
    });

    groupedColumns.set(groupTitle, current);
  }

  const featuredItems = categories
    .map((category) => ({
      name: category.name,
      slug: category.slug,
      productCount: countMap.get(category._id.toString()) ?? 0
    }))
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 4)
    .map((item, index) => ({
      name: index === 0 ? `Top danh mục: ${item.name}` : item.name,
      slug: item.slug,
      productCount: item.productCount,
      isHighlight: index < 2,
      description: `${item.productCount} sản phẩm`
    }));

  const saleItem = {
    name: "Sản Phẩm Giảm Giá",
    slug: "sale",
    description: "Các sản phẩm đang có mức giá ưu đãi",
    productCount: 99,
    isHighlight: true
  };

  const columns: MegaMenuColumn[] = [
    { title: "SẢN PHẨM ƯU ĐÃI", items: [saleItem, ...featuredItems] },
    { title: "ÁO", items: groupedColumns.get("ÁO") ?? [] },
    { title: "QUẦN", items: groupedColumns.get("QUẦN") ?? [] },
    {
      title: "PHỤ KIỆN",
      items: [...(groupedColumns.get("PHỤ KIỆN") ?? []), ...(groupedColumns.get("DANH MỤC KHÁC") ?? [])]
    }
  ];

  return columns.filter((column) => column.items.length > 0);
};

export const listProducts = async (query: ProductQuery) => {
  const filters: Record<string, unknown> = { isActive: true };

  if (query.category) {
    if (query.category === "sale") {
      filters.discountPercent = { $gt: 0 };
    } else {
      const category = await CategoryModel.findOne({ slug: query.category });
      if (!category) {
        return [];
      }
      filters.categoryId = category._id;
    }
  }

  if (query.q) {
    filters.$text = { $search: query.q };
  }

  const products = await ProductModel.find(filters).sort({ createdAt: -1 }).lean();
  const categories = await CategoryModel.find({
    _id: { $in: [...new Set(products.map((p) => p.categoryId.toString()))] }
  }).lean();
  const categoryMap = new Map(categories.map((c) => [c._id.toString(), c.name]));
  const productIds = products.map((p) => p._id);
  const variants = await ProductVariantModel.find({ productId: { $in: productIds } }).lean();

  const variantMap = new Map<string, typeof variants>();
  for (const variant of variants) {
    const key = variant.productId.toString();
    const current = variantMap.get(key) ?? [];
    current.push(variant);
    variantMap.set(key, current);
  }

  return products
    .map((product) => {
      const productVariants = variantMap.get(product._id.toString()) ?? [];
      const sizes = [...new Set(productVariants.map((v) => v.size).filter(Boolean))];
      const colors = [...new Set(productVariants.map((v) => v.color).filter(Boolean))];

      if (query.size && !sizes.includes(query.size)) {
        return null;
      }

      if (query.color && !colors.includes(query.color)) {
        return null;
      }

      const inStock = productVariants.some((v) => v.stockQuantity > 0);
      const colorImages = productVariants.reduce((acc, v) => {
        if (v.color && v.imageUrl) {
          acc[v.color] = v.imageUrl;
        }
        return acc;
      }, {} as Record<string, string>);

      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discountPercent: product.discountPercent,
        category: categoryMap.get(product.categoryId.toString()) ?? "Uncategorized",
        imageUrl: product.imageUrl,
        sizes,
        colors,
        colorImages,
        inStock,
        slug: product.slug
      };
    })
    .filter(Boolean);
};

export const getProductById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product id");
  }

  const product = await ProductModel.findById(id).lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const [category, variants, images] = await Promise.all([
    CategoryModel.findById(product.categoryId).lean(),
    ProductVariantModel.find({ productId: product._id }).lean(),
    ProductImageModel.find({ productId: product._id }).sort({ sortOrder: 1, createdAt: 1 }).lean()
  ]);
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const colorImages = variants.reduce((acc, v) => {
    if (v.color && v.imageUrl) {
      acc[v.color] = v.imageUrl;
    }
    return acc;
  }, {} as Record<string, string>);
  const imageGallery = images.map((image) => ({
    _id: image._id,
    url: image.url,
    alt: image.alt,
    sortOrder: image.sortOrder
  }));

  return {
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountPercent: product.discountPercent,
    category: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "",
    imageUrl: product.imageUrl,
    sizeGuideImageUrl: product.sizeGuideImageUrl ?? "",
    images: imageGallery,
    sizes,
    colors,
    colorImages,
    inStock: variants.some((v) => v.stockQuantity > 0),
    slug: product.slug,
    variants
  };
};

export const listFeaturedProducts = async () => {
  const products = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(8);
  return Promise.all(products.map((p) => getProductById(p._id.toString())));
};
