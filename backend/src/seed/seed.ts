import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { ProductModel } from "../models/product.model.js";
import { CategoryModel } from "../models/category.model.js";

interface ProductData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  category: string;
  imageUrl: string;
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string>;
  inStock: boolean;
  slug: string;
}

interface DataFile {
  success: boolean;
  message: string;
  data: ProductData[];
}

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log("✓ Connected to database");

    // Load data from JSON file
    const dataPath = path.join(process.cwd(), "src/seed/data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const jsonData: DataFile = JSON.parse(rawData);
    
    console.log(`✓ Loaded ${jsonData.data.length} products from data.json`);

    // Clear existing products
    await ProductModel.deleteMany({});
    console.log("✓ Cleared existing products");

    // Process and seed products
    let successCount = 0;
    let errorCount = 0;

    for (const productData of jsonData.data) {
      try {
        // Find or create category
        let category = await CategoryModel.findOne({
          name: productData.category
        });

        if (!category) {
          // Create category slug from name
          const categorySlug = productData.category
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

          category = await CategoryModel.create({
            name: productData.category,
            slug: categorySlug
          });
          console.log(`  + Created new category: ${productData.category}`);
        }

        // Create product
        await ProductModel.create({
          categoryId: category._id,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          discountPercent: productData.discountPercent || 0,
          imageUrl: productData.imageUrl,
          isActive: productData.inStock ?? true
        });

        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`  ✗ Error seeding product "${productData.name}":`, error instanceof Error ? error.message : error);
      }
    }

    console.log("\n=== Seeding Summary ===");
    console.log(`✓ Successfully seeded: ${successCount} products`);
    if (errorCount > 0) {
      console.log(`✗ Failed to seed: ${errorCount} products`);
    }

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
  } catch (error) {
    console.error("✗ Error during seeding:", error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
seedDatabase();
