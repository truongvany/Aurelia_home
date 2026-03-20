import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/userProfile.model.js";

const usersSeed = [
  {
    email: "admin@aurelia.com",
    password: "Admin123@456",
    firstName: "Admin",
    lastName: "Aurelia",
    phone: "+84901234567",
    role: "admin"
  },
  {
    email: "user@aurelia.com",
    password: "User123@456",
    firstName: "Nguyễn",
    lastName: "Văn A",
    phone: "+84901234568",
    role: "customer"
  },
  {
    email: "customer1@aurelia.com",
    password: "Customer123@456",
    firstName: "Trần",
    lastName: "Thị B",
    phone: "+84901234569",
    role: "customer"
  },
  {
    email: "customer2@aurelia.com",
    password: "Customer123@456",
    firstName: "Lê",
    lastName: "Văn C",
    phone: "+84901234570",
    role: "customer"
  }
];

export const seedUsers = async () => {
  try {
    await connectDatabase();

    // Clear existing users
    await UserModel.deleteMany({});
    await UserProfileModel.deleteMany({});

    console.log("Seeding users...");

    for (const userData of usersSeed) {
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await UserModel.create({
        email: userData.email.toLowerCase(),
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role
      });

      // Create user profile
      await UserProfileModel.create({
        userId: user._id
      });

      console.log(`✓ Created ${userData.role} account: ${userData.email}`);
    }

    console.log("\n✓ Users seeded successfully!");
    console.log("\n📋 Accounts created:");
    console.log("─────────────────────────────────────────");
    usersSeed.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log(`─────────────────────────────────────────`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
