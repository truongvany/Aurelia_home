import { Types } from "mongoose";
import { OrderModel } from "../models/order.model.js";
import { ReviewModel } from "../models/review.model.js";
import { ApiError } from "../utils/ApiError.js";

interface CreateReviewInput {
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export const createReview = async (input: CreateReviewInput) => {
  if (!Types.ObjectId.isValid(input.productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  const existing = await ReviewModel.findOne({
    userId: input.userId,
    productId: input.productId
  });
  if (existing) {
    throw new ApiError(409, "You already reviewed this product");
  }

  const verifiedOrder = await OrderModel.findOne({
    userId: input.userId,
    "items.productId": input.productId,
    status: { $in: ["paid", "shipped", "delivered"] }
  });

  return ReviewModel.create({
    ...input,
    isVerifiedPurchase: Boolean(verifiedOrder)
  });
};

export const listReviewsByProduct = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  return ReviewModel.find({ productId }).sort({ createdAt: -1 });
};
