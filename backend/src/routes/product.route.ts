import { Router } from "express";
import {
  getCategories,
  getFeatured,
  getProduct,
  getProducts,
  getMegaMenu
} from "../controllers/product.controller.js";

const router = Router();

router.get("/megamenu", getMegaMenu);
router.get("/categories", getCategories);
router.get("/products/featured", getFeatured);
router.get("/products", getProducts);
router.get("/products/:id", getProduct);

export default router;
