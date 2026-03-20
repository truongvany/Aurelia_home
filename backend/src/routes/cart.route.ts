import { Router } from "express";
import {
  addItem,
  applyCoupon,
  clear,
  fetchCart,
  removeCoupon,
  removeItem,
  updateItem
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", fetchCart);
router.post("/items", addItem);
router.put("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);
router.post("/apply-coupon", applyCoupon);
router.post("/remove-coupon", removeCoupon);
router.post("/clear", clear);

export default router;
