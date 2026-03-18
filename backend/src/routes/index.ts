import { Router } from "express";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js";
import cartRoutes from "./cart.route.js";
import orderRoutes from "./order.route.js";
import reviewRoutes from "./review.route.js";
import profileRoutes from "./profile.route.js";
import contactRoutes from "./contact.route.js";
import chatRoutes from "./chat.route.js";
import adminRoutes from "./admin.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/catalog", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/profile", profileRoutes);
router.use("/contact", contactRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminRoutes);

export default router;
