import { Router } from "express";
import {
  getCategories,
  getFeatured,
  getProduct,
  getProducts
} from "../controllers/product.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/products/featured", getFeatured);
router.get("/products", getProducts);
router.get("/products/:id", getProduct);

export default router;
