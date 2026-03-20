import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { ProductImageModel } from "../models/productImage.model.js";
import { InventoryLogModel } from "../models/inventoryLog.model.js";

interface RootCategorySeed {
  name: string;
  slug: string;
  description: string;
}

interface ChildCategorySeed {
  parentSlug: string;
  name: string;
  slug: string;
  description: string;
}

interface ProductSeed {
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  colors: string[];
  sizeType: "apparel" | "pants" | "one-size";
}

const rootCategories: RootCategorySeed[] = [
  {
    name: "SẢN PHẨM ƯU ĐÃI",
    slug: "san-pham-uu-dai",
    description: "Nhung danh muc uu dai noi bat"
  },
  {
    name: "ÁO",
    slug: "ao",
    description: "Danh muc ao nam"
  },
  {
    name: "QUẦN",
    slug: "quan",
    description: "Danh muc quan nam"
  },
  {
    name: "PHỤ KIỆN",
    slug: "phu-kien",
    description: "Danh muc phu kien nam"
  }
];

const childCategories: ChildCategorySeed[] = [
  { parentSlug: "san-pham-uu-dai", name: "Top sản phẩm bán chạy", slug: "top-san-pham-ban-chay", description: "San pham ban chay" },
  { parentSlug: "san-pham-uu-dai", name: "Áo polo sale", slug: "ao-polo-sale", description: "Polo uu dai" },
  { parentSlug: "san-pham-uu-dai", name: "Quần âu sale", slug: "quan-au-sale", description: "Quan au uu dai" },

  { parentSlug: "ao", name: "Áo thun", slug: "ao-thun", description: "Ao thun co ban" },
  { parentSlug: "ao", name: "Áo sơ mi dài", slug: "ao-so-mi-dai", description: "Ao so mi tay dai" },
  { parentSlug: "ao", name: "Áo sơ mi ngắn", slug: "ao-so-mi-ngan", description: "Ao so mi tay ngan" },
  { parentSlug: "ao", name: "Áo khoác", slug: "ao-khoac", description: "Ao khoac nhe va coat" },
  { parentSlug: "ao", name: "Áo vest", slug: "ao-vest", description: "Ao vest lich lam" },

  { parentSlug: "quan", name: "Quần jeans", slug: "quan-jeans", description: "Quan jeans nam" },
  { parentSlug: "quan", name: "Quần kaki", slug: "quan-kaki", description: "Quan kaki cong so" },
  { parentSlug: "quan", name: "Quần short", slug: "quan-short", description: "Quan short nang dong" },
  { parentSlug: "quan", name: "Quần tây", slug: "quan-tay", description: "Quan tay lich su" },
  { parentSlug: "quan", name: "Quần ngố kaki", slug: "quan-ngo-kaki", description: "Quan ngo phong cach" },

  { parentSlug: "phu-kien", name: "Mũ", slug: "mu", description: "Mu thoi trang" },
  { parentSlug: "phu-kien", name: "Dây lưng nam", slug: "day-lung-nam", description: "That lung da nam" },
  { parentSlug: "phu-kien", name: "Tất nam", slug: "tat-nam", description: "Tat nam cong so" },
  { parentSlug: "phu-kien", name: "Giày da", slug: "giay-da", description: "Giay da cao cap" }
];

const productsSeed: ProductSeed[] = [
  {
    categorySlug: "top-san-pham-ban-chay",
    name: "Polo Bestseller Regular",
    slug: "polo-bestseller-regular",
    description: "Polo form regular, chat cotton mem, de phoi do.",
    price: 1290000,
    imageUrl: "https://picsum.photos/seed/polo-best/900/1200",
    colors: ["White", "Navy"],
    sizeType: "apparel"
  },
  {
    categorySlug: "ao-polo-sale",
    name: "Polo Sale Signature",
    slug: "polo-sale-signature",
    description: "Polo gia uu dai voi duong may chac chan.",
    price: 990000,
    imageUrl: "https://picsum.photos/seed/polo-sale/900/1200",
    colors: ["Black", "Beige"],
    sizeType: "apparel"
  },
  {
    categorySlug: "quan-au-sale",
    name: "Quan Au Sale Slim",
    slug: "quan-au-sale-slim",
    description: "Quan au slim fit, phu hop di lam va su kien.",
    price: 1390000,
    imageUrl: "https://picsum.photos/seed/trouser-sale/900/1200",
    colors: ["Charcoal", "Navy"],
    sizeType: "pants"
  },
  {
    categorySlug: "ao-thun",
    name: "Ao Thun Cotton Prime",
    slug: "ao-thun-cotton-prime",
    description: "Ao thun toi gian, de mac hang ngay.",
    price: 590000,
    imageUrl: "https://picsum.photos/seed/ao-thun/900/1200",
    colors: ["White", "Black"],
    sizeType: "apparel"
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Ao So Mi Dai Oxford",
    slug: "ao-so-mi-dai-oxford",
    description: "Ao so mi tay dai phong cach business casual.",
    price: 1190000,
    imageUrl: "https://picsum.photos/seed/ao-somi-dai/900/1200",
    colors: ["White", "Light Blue"],
    sizeType: "apparel"
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Ao So Mi Ngan Linen",
    slug: "ao-so-mi-ngan-linen",
    description: "Ao so mi ngan tay thoang mat cho mua he.",
    price: 1090000,
    imageUrl: "https://picsum.photos/seed/ao-somi-ngan/900/1200",
    colors: ["Beige", "Navy"],
    sizeType: "apparel"
  },
  {
    categorySlug: "ao-khoac",
    name: "Ao Khoac Bomber Urban",
    slug: "ao-khoac-bomber-urban",
    description: "Ao khoac bomber gon gang, giu am vua du.",
    price: 1890000,
    imageUrl: "https://picsum.photos/seed/ao-khoac/900/1200",
    colors: ["Olive", "Black"],
    sizeType: "apparel"
  },
  {
    categorySlug: "ao-vest",
    name: "Ao Vest Modern Fit",
    slug: "ao-vest-modern-fit",
    description: "Vest modern fit ton dang, chat lieu mem min.",
    price: 3490000,
    imageUrl: "https://picsum.photos/seed/ao-vest/900/1200",
    colors: ["Charcoal", "Navy"],
    sizeType: "apparel"
  },
  {
    categorySlug: "quan-jeans",
    name: "Quan Jeans Indigo Straight",
    slug: "quan-jeans-indigo-straight",
    description: "Jeans dang straight, mau indigo co dien.",
    price: 1290000,
    imageUrl: "https://picsum.photos/seed/quan-jeans/900/1200",
    colors: ["Indigo", "Black"],
    sizeType: "pants"
  },
  {
    categorySlug: "quan-kaki",
    name: "Quan Kaki Premium",
    slug: "quan-kaki-premium",
    description: "Quan kaki mem, phoi tot voi so mi va polo.",
    price: 1190000,
    imageUrl: "https://picsum.photos/seed/quan-kaki/900/1200",
    colors: ["Khaki", "Stone"],
    sizeType: "pants"
  },
  {
    categorySlug: "quan-short",
    name: "Quan Short Resort",
    slug: "quan-short-resort",
    description: "Quan short nhe, thich hop du lich va cuoi tuan.",
    price: 790000,
    imageUrl: "https://picsum.photos/seed/quan-short/900/1200",
    colors: ["Beige", "Navy"],
    sizeType: "pants"
  },
  {
    categorySlug: "quan-tay",
    name: "Quan Tay Business Slim",
    slug: "quan-tay-business-slim",
    description: "Quan tay slim cho moi truong cong so.",
    price: 1490000,
    imageUrl: "https://picsum.photos/seed/quan-tay/900/1200",
    colors: ["Black", "Gray"],
    sizeType: "pants"
  },
  {
    categorySlug: "quan-ngo-kaki",
    name: "Quan Ngo Kaki Summer",
    slug: "quan-ngo-kaki-summer",
    description: "Quan ngo chat kaki nhe, mac rat thoai mai.",
    price: 890000,
    imageUrl: "https://picsum.photos/seed/quan-ngo-kaki/900/1200",
    colors: ["Khaki", "Olive"],
    sizeType: "pants"
  },
  {
    categorySlug: "mu",
    name: "Mu Luoi Trai Minimal",
    slug: "mu-luoi-trai-minimal",
    description: "Mu luoi trai toi gian cho phong cach street.",
    price: 490000,
    imageUrl: "https://picsum.photos/seed/mu/900/1200",
    colors: ["Black", "Beige"],
    sizeType: "one-size"
  },
  {
    categorySlug: "day-lung-nam",
    name: "Day Lung Da Classic",
    slug: "day-lung-da-classic",
    description: "That lung da that, khoa kim loai ben dep.",
    price: 790000,
    imageUrl: "https://picsum.photos/seed/day-lung/900/1200",
    colors: ["Brown", "Black"],
    sizeType: "one-size"
  },
  {
    categorySlug: "tat-nam",
    name: "Tat Nam Cotton Fine",
    slug: "tat-nam-cotton-fine",
    description: "Tat cotton mem, hut am tot cho ngay dai.",
    price: 190000,
    imageUrl: "https://picsum.photos/seed/tat-nam/900/1200",
    colors: ["Navy", "Gray"],
    sizeType: "one-size"
  },
  {
    categorySlug: "giay-da",
    name: "Giay Da Oxford Heritage",
    slug: "giay-da-oxford-heritage",
    description: "Giay da oxford cho style lich lam.",
    price: 2690000,
    imageUrl: "https://picsum.photos/seed/giay-da/900/1200",
    colors: ["Black", "Brown"],
    sizeType: "one-size"
  }
];

const sizesByType: Record<ProductSeed["sizeType"], string[]> = {
  apparel: ["S", "M", "L"],
  pants: ["30", "32", "34"],
  "one-size": ["One"]
};

const runSeed = async () => {
  await connectDatabase();

  // Reset only catalog-related collections for clean menu/filter demo data.
  await Promise.all([
    InventoryLogModel.deleteMany({}),
    ProductVariantModel.deleteMany({}),
    ProductImageModel.deleteMany({}),
    ProductModel.deleteMany({}),
    CategoryModel.deleteMany({})
  ]);

  const rootMap = new Map<string, mongoose.Types.ObjectId>();
  for (const root of rootCategories) {
    const created = await CategoryModel.create({
      name: root.name,
      slug: root.slug,
      description: root.description,
      parentId: null
    });
    rootMap.set(root.slug, created._id);
  }

  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const child of childCategories) {
    const parentId = rootMap.get(child.parentSlug);
    if (!parentId) {
      throw new Error(`Parent category missing for ${child.slug}`);
    }

    const created = await CategoryModel.create({
      name: child.name,
      slug: child.slug,
      description: child.description,
      parentId
    });

    categoryMap.set(child.slug, created._id);
  }

  const createdProducts = [] as Array<{ _id: mongoose.Types.ObjectId; slug: string; imageUrl: string; name: string }>;

  for (const product of productsSeed) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Category missing for product ${product.slug}`);
    }

    const createdProduct = await ProductModel.create({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      categoryId,
      imageUrl: product.imageUrl,
      isActive: true
    });

    createdProducts.push({
      _id: createdProduct._id,
      slug: createdProduct.slug,
      imageUrl: createdProduct.imageUrl,
      name: createdProduct.name
    });

    const sizes = sizesByType[product.sizeType];
    const variants = sizes.flatMap((size) =>
      product.colors.map((color, colorIndex) => ({
        productId: createdProduct._id,
        sku: `${product.slug.toUpperCase().replace(/-/g, "_")}_${size}_${colorIndex + 1}`,
        size,
        color,
        stockQuantity: 20 + colorIndex * 5,
        priceAdjustment: 0,
        imageUrl: product.imageUrl
      }))
    );

    const insertedVariants = await ProductVariantModel.insertMany(variants);
    await InventoryLogModel.insertMany(
      insertedVariants.map((variant) => ({
        productVariantId: variant._id,
        type: "seed" as const,
        delta: variant.stockQuantity,
        note: "Initial stock for mega menu seed"
      }))
    );
  }

  await ProductImageModel.insertMany(
    createdProducts.flatMap((product) => [
      {
        productId: product._id,
        url: product.imageUrl,
        alt: product.name,
        sortOrder: 0
      },
      {
        productId: product._id,
        url: `https://picsum.photos/seed/${product.slug}-alt/900/1200`,
        alt: `${product.name} alternate image`,
        sortOrder: 1
      }
    ])
  );

  console.log("Fashion mega menu seed completed.");
  console.log(`Root categories: ${rootCategories.length}`);
  console.log(`Sub categories: ${childCategories.length}`);
  console.log(`Products: ${createdProducts.length}`);

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error("Fashion mega menu seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
