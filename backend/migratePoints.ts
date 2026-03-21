import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { UserModel } from "./src/models/user.model.js";
import { OrderModel } from "./src/models/order.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB.");

    // The timestamp when we deployed the point accumulation feature
    // To ensure we get all past orders without double counting if ran again:
    const featureDeploymentDate = new Date("2026-03-21T15:05:55.000Z"); // Right before now

    const users = await UserModel.find({});
    console.log(`Found ${users.length} users.`);

    let updatedCount = 0;

    for (const user of users) {
      // Find historical orders (not cancelled, before feature deployment)
      const historicalOrders = await OrderModel.find({
        userId: user._id,
        status: { $ne: "cancelled" },
        createdAt: { $lt: featureDeploymentDate }
      });

      // Reset points first before calculating to prevent double addition 
      // in case script is run multiple times
      user.points = 0;
      let addedPoints = 0;

      for (const order of historicalOrders) {
         // Tính điểm trên tổng tiền để user thấy khớp với UI "Tổng tiền" 
         // Hoặc tính trên finalAmount tuỳ business, nhưng ở đây tính trên totalAmount cho rộng rai
         const points = Math.floor((order.totalAmount || order.finalAmount || 0) / 10000);
         addedPoints += points;
      }

      if (addedPoints > 0) {
        user.points = addedPoints;
        
        const estimatedSpend = user.points * 10000;
        if (estimatedSpend >= 20000000) user.tier = "Vàng";
        else if (estimatedSpend >= 5000000) user.tier = "Bạc";
        else user.tier = "Mới";

        await user.save();
        updatedCount++;
        console.log(`User ${user.email}: granted ${addedPoints} points from ${historicalOrders.length} historical orders. Tier: ${user.tier}`);
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} users.`);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

run();
