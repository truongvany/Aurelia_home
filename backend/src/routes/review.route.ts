import { Router } from "express";
import { addReview, getReviewsByProduct } from "../controllers/review.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/product/:productId", getReviewsByProduct);
router.post("/", requireAuth, addReview);

export default router;
