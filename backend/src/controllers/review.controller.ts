import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { createReview, listReviewsByProduct } from "../services/review.service.js";

export const getReviewsByProduct = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await listReviewsByProduct(req.params.productId);
  sendSuccess(res, reviews, "Reviews fetched");
});

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { productId, rating, title, comment } = req.body;
  if (!productId || !rating) {
    throw new ApiError(400, "productId and rating are required");
  }

  const review = await createReview({
    userId,
    productId,
    rating: Number(rating),
    title,
    comment
  });

  sendSuccess(res, review, "Review submitted", 201);
});
