import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { UserModel } from "./src/models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB.");

    const users = await UserModel.find({
      $or: [{ customerCode: { $exists: false } }, { customerCode: null }]
    });
    console.log(`Found ${users.length} users needing customer code.`);

    for (const user of users) {
      user.customerCode = "KM-" + user._id.toString().slice(-6).toUpperCase();
      await user.save();
    }
    
    console.log("Migration completed.");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

run();
