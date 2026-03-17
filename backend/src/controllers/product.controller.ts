import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  getProductById,
  listCategories,
  listFeaturedProducts,
  listProducts
} from "../services/product.service.js";

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await listCategories();
  sendSuccess(res, categories, "Categories fetched");
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await listProducts({
    category: req.query.category?.toString(),
    size: req.query.size?.toString(),
    color: req.query.color?.toString(),
    q: req.query.q?.toString()
  });
  sendSuccess(res, products, "Products fetched");
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  sendSuccess(res, product, "Product fetched");
});

export const getFeatured = asyncHandler(async (_req: Request, res: Response) => {
  const products = await listFeaturedProducts();
  sendSuccess(res, products, "Featured products fetched");
});
