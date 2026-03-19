import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";

const shirtProducts = [
  {
    name: "Áo Sơ Mi Oxford Trắng",
    slug: "oxford-white-shirt",
    description: "Áo sơ mi Oxford trắng cơ bản, dễ dàng phối đồ và mặc hàng ngày.",
    price: 2890000,
    imageUrl: "https://thoitrangbigsize.vn/wp-content/uploads/2025/05/Trang-4.jpg",
    variants: [
      { sku: "OXW-S", size: "S", color: "White", stockQuantity: 32 },
      { sku: "OXW-M", size: "M", color: "White", stockQuantity: 28 },
      { sku: "OXW-L", size: "L", color: "White", stockQuantity: 24 }
    ]
  },
  {
    name: "Áo Sơ Mi Linen Kẻ Sọc",
    slug: "linen-striped-shirt",
    description: "Áo sơ mi linen họa tiết sọc nhẹ, thoáng mát cho ngày hè.",
    price: 3190000,
    imageUrl: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/482470/item/goods_64_482470_3x4.jpg?width=369",
    variants: [
      { sku: "LSS-S", size: "S", color: "Light Blue", stockQuantity: 20 },
      { sku: "LSS-M", size: "M", color: "Light Blue", stockQuantity: 22 },
      { sku: "LSS-L", size: "L", color: "Light Blue", stockQuantity: 18 }
    ]
  },
  {
    name: "Áo Sơ Mi Denim Xanh",
    slug: "denim-blue-shirt",
    description: "Áo sơ mi denim dày dặn, dễ phối cùng áo khoác và jean.",
    price: 3490000,
    imageUrl: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455951/item/goods_64_455951_3x4.jpg?width=369",
    variants: [
      { sku: "DBS-M", size: "M", color: "Denim Blue", stockQuantity: 18 },
      { sku: "DBS-L", size: "L", color: "Denim Blue", stockQuantity: 15 },
      { sku: "DBS-XL", size: "XL", color: "Denim Blue", stockQuantity: 12 }
    ]
  },
  {
    name: "Áo Sơ Mi Poplin Slim",
    slug: "poplin-slim-shirt",
    description: "Áo poplin cắt slim fit, thích hợp cho vest và suit.",
    price: 2790000,
    imageUrl: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455967/item/goods_02_455967_3x4.jpg?width=369",
    variants: [
      { sku: "PSS-S", size: "S", color: "White", stockQuantity: 26 },
      { sku: "PSS-M", size: "M", color: "White", stockQuantity: 24 },
      { sku: "PSS-L", size: "L", color: "White", stockQuantity: 20 }
    ]
  },
  {
    name: "Áo Sơ Mi Họa Tiết Hoa",
    slug: "floral-print-shirt",
    description: "Áo sơ mi họa tiết hoa nhẹ nhàng, phù hợp dạo phố cuối tuần.",
    price: 3090000,
    imageUrl: "https://pos.nvncdn.com/492284-9176/ps/20230419_rgw9gKNpgq.jpeg?v=1681915518",
    variants: [
      { sku: "FPS-S", size: "S", color: "Navy Floral", stockQuantity: 18 },
      { sku: "FPS-M", size: "M", color: "Navy Floral", stockQuantity: 20 },
      { sku: "FPS-L", size: "L", color: "Navy Floral", stockQuantity: 16 }
    ]
  },
  {
    name: "Áo Sơ Mi Kẻ Sọc Pinstripe",
    slug: "pinstripe-shirt",
    description: "Áo sơ mi pinstripe sang trọng, phù hợp công sở và sự kiện.",
    price: 3390000,
    imageUrl: "https://bizweb.dktcdn.net/100/408/038/products/z6427970808801-8481a706584f0780c571f69ef949b871-b0d4cd86-d610-41bd-9a97-8984f0c02504.jpg?v=1746583606683",
    variants: [
      { sku: "PST-S", size: "S", color: "Gray Pinstripe", stockQuantity: 22 },
      { sku: "PST-M", size: "M", color: "Gray Pinstripe", stockQuantity: 24 },
      { sku: "PST-L", size: "L", color: "Gray Pinstripe", stockQuantity: 20 }
    ]
  },
  {
    name: "Áo Sơ Mi Cổ Trụ Mandarin",
    slug: "mandarin-collar-shirt",
    description: "Áo sơ mi cổ trụ phong cách Á châu, nhẹ nhàng và tinh tế.",
    price: 2990000,
    imageUrl: "https://bizweb.dktcdn.net/100/502/737/products/o1cn01mps5vl1gbkg2zmego2967904-2137c122-8365-439e-aed3-72391738fe93.jpg?v=1741594050483",
    variants: [
      { sku: "MCS-S", size: "S", color: "Cream", stockQuantity: 20 },
      { sku: "MCS-M", size: "M", color: "Cream", stockQuantity: 18 },
      { sku: "MCS-L", size: "L", color: "Cream", stockQuantity: 14 }
    ]
  },
  {
    name: "Áo Sơ Mi Oxford Xanh Navy",
    slug: "navy-oxford-shirt",
    description: "Phiên bản Oxford xanh navy trơn, dễ phối và bền bỉ.",
    price: 2790000,
    imageUrl: "https://product.hstatic.net/200000469141/product/cb05636c-f06a-448c-b4c7-a12aaf58d419_e2f002e3325c40159ba97f5044d14843_master.jpg",
    variants: [
      { sku: "NOS-S", size: "S", color: "Navy", stockQuantity: 26 },
      { sku: "NOS-M", size: "M", color: "Navy", stockQuantity: 24 },
      { sku: "NOS-L", size: "L", color: "Navy", stockQuantity: 22 }
    ]
  },
  {
    name: "Áo Sơ Mi Linen Oversize",
    slug: "linen-oversize-shirt",
    description: "Áo linen oversize, phong cách thư giãn cho mùa hè.",
    price: 3190000,
    imageUrl: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/455957/sub/vngoods_455957_sub11_3x4.jpg?width=369",
    variants: [
      { sku: "LOS-S", size: "S", color: "Beige", stockQuantity: 18 },
      { sku: "LOS-M", size: "M", color: "Beige", stockQuantity: 20 },
      { sku: "LOS-L", size: "L", color: "Beige", stockQuantity: 16 }
    ]
  },
  {
    name: "Áo Sơ Mi Dệt Twill",
    slug: "twill-woven-shirt",
    description: "Áo sơ mi dệt twill mềm mịn, bền và ít nhăn.",
    price: 3290000,
    imageUrl: "https://thoitrangbigsize.vn/wp-content/uploads/2024/09/BS2978.jpg",
    variants: [
      { sku: "TWS-S", size: "S", color: "White", stockQuantity: 22 },
      { sku: "TWS-M", size: "M", color: "White", stockQuantity: 20 },
      { sku: "TWS-L", size: "L", color: "White", stockQuantity: 18 }
    ]
  }
];

const runSeed = async () => {
  await connectDatabase();

  const shirtCategory = await CategoryModel.findOne({ slug: "shirts" });
  if (!shirtCategory) {
    throw new Error('Category "shirts" not found. Please run the full seed first or create the category.');
  }

  for (const shirt of shirtProducts) {
    const existing = await ProductModel.findOne({ slug: shirt.slug });
    if (existing) {
      console.log(`Skipping existing product: ${shirt.slug}`);
      continue;
    }

    const created = await ProductModel.create({
      name: shirt.name,
      slug: shirt.slug,
      description: shirt.description,
      price: shirt.price,
      categoryId: shirtCategory._id,
      imageUrl: shirt.imageUrl,
      isActive: true
    });

    await ProductVariantModel.insertMany(
      shirt.variants.map((variant) => ({
        productId: created._id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stockQuantity: variant.stockQuantity,
        priceAdjustment: 0
      }))
    );

    console.log(`Seeded shirt product: ${shirt.slug}`);
  }

  await mongoose.disconnect();
  console.log("Shirt seed completed.");
};

runSeed().catch(async (error) => {
  console.error("Shirt seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
