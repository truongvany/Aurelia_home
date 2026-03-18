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

export const listCategories = async () => CategoryModel.find().sort({ name: 1 });

export const listProducts = async (query: ProductQuery) => {
  const filters: Record<string, unknown> = { isActive: true };

  if (query.category) {
    const category = await CategoryModel.findOne({ slug: query.category });
    if (category) {
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

      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: categoryMap.get(product.categoryId.toString()) ?? "Uncategorized",
        imageUrl: product.imageUrl,
        sizes,
        colors,
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
    category: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "",
    imageUrl: product.imageUrl,
    images: imageGallery,
    sizes,
    colors,
    inStock: variants.some((v) => v.stockQuantity > 0),
    slug: product.slug,
    variants
  };
};

export const listFeaturedProducts = async () => {
  const products = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 }).limit(8);
  return Promise.all(products.map((p) => getProductById(p._id.toString())));
};
