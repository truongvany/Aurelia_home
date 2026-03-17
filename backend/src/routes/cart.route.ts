import { Router } from "express";
import {
  addItem,
  clear,
  fetchCart,
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
router.post("/clear", clear);

export default router;
