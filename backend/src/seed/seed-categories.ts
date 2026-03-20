import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { CategoryModel } from "../models/category.model.js";

const categoriesSeed = [
  // Main Categories
  {
    name: "Sản Phẩm Ưu Đãi",
    slug: "san-pham-uu-dai",
    description: "Các sản phẩm đang được ưu đãi đặc biệt",
  },
  {
    name: "Áo",
    slug: "ao",
    description: "Áo nam công sở - áo sơ mi, áo khoác, áo thun, áo vest",
  },
  {
    name: "Quần",
    slug: "quan",
    description: "Quần nam công sở - quần tây, quần kaki, quần jeans",
  },
  {
    name: "Phụ Kiện",
    slug: "phu-kien",
    description: "Phụ kiện nam - dây lưng, giày, mũ, tất",
  },
];

const subcategoriesSeed = [
  // Subcategories for "Sản Phẩm Ưu Đãi"
  {
    name: "Áo Polo Sale",
    slug: "ao-polo-sale",
    description: "Áo polo nam giảm giá",
    parentSlug: "san-pham-uu-dai",
  },
  {
    name: "Quần Âu Sale",
    slug: "quan-au-sale",
    description: "Quần âu nam giảm giá",
    parentSlug: "san-pham-uu-dai",
  },
  {
    name: "Top Sản Phẩm Bán Chạy",
    slug: "top-san-pham-ban-chay",
    description: "Top các sản phẩm bán chạy nhất",
    parentSlug: "san-pham-uu-dai",
  },

  // Subcategories for "Áo"
  {
    name: "Áo Sơ Mi Dài",
    slug: "ao-so-mi-dai",
    description: "Áo sơ mi dài tay nam",
    parentSlug: "ao",
  },
  {
    name: "Áo Sơ Mi Ngắn",
    slug: "ao-so-mi-ngan",
    description: "Áo sơ mi ngắn tay nam",
    parentSlug: "ao",
  },
  {
    name: "Áo Khoác",
    slug: "ao-khoac",
    description: "Áo khoác nam công sở",
    parentSlug: "ao",
  },
  {
    name: "Áo Thun",
    slug: "ao-thun",
    description: "Áo thun nam cao cấp",
    parentSlug: "ao",
  },
  {
    name: "Áo Vest",
    slug: "ao-vest",
    description: "Áo vest nam chính hãng",
    parentSlug: "ao",
  },

  // Subcategories for "Quần"
  {
    name: "Quần Tây",
    slug: "quan-tay",
    description: "Quần tây nam công sở",
    parentSlug: "quan",
  },
  {
    name: "Quần Kaki",
    slug: "quan-kaki",
    description: "Quần kaki nam công sở",
    parentSlug: "quan",
  },
  {
    name: "Quần Ngô Kaki",
    slug: "quan-ngo-kaki",
    description: "Quần chino nam cao cấp",
    parentSlug: "quan",
  },
  {
    name: "Quần Jeans",
    slug: "quan-jeans",
    description: "Quần jeans nam cao cấp",
    parentSlug: "quan",
  },
  {
    name: "Quần Short",
    slug: "quan-short",
    description: "Quần short nam công sở",
    parentSlug: "quan",
  },

  // Subcategories for "Phụ Kiện"
  {
    name: "Dây Lưng Nam",
    slug: "day-lung-nam",
    description: "Dây lưng nam da cao cấp",
    parentSlug: "phu-kien",
  },
  {
    name: "Giày Da",
    slug: "giay-da",
    description: "Giày da nam công sở",
    parentSlug: "phu-kien",
  },
  {
    name: "Mũ",
    slug: "mu",
    description: "Mũ nón nam thời trang",
    parentSlug: "phu-kien",
  },
  {
    name: "Tất Nam",
    slug: "tat-nam",
    description: "Tất nam cao cấp",
    parentSlug: "phu-kien",
  },
];

export const seedCategories = async () => {
  try {
    await connectDatabase();

    // Clear existing categories
    await CategoryModel.deleteMany({});

    console.log("📁 Seeding categories...");

    // Create main categories first
    const mainCategoryMap: { [key: string]: string } = {};
    for (const category of categoriesSeed) {
      const created = await CategoryModel.create(category);
      mainCategoryMap[category.slug] = created._id.toString();
      console.log(`✓ Created category: ${category.name}`);
    }

    // Create subcategories
    for (const subCategory of subcategoriesSeed) {
      const parentId = mainCategoryMap[subCategory.parentSlug];
      const created = await CategoryModel.create({
        name: subCategory.name,
        slug: subCategory.slug,
        description: subCategory.description,
        parentId: new mongoose.Types.ObjectId(parentId),
      });
      console.log(`✓ Created subcategory: ${subCategory.name}`);
    }

    console.log("\n✓ Categories seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
