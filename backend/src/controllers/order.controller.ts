import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getOrderById, listOrdersByUser, placeOrder } from "../services/order.service.js";

const getUserId = (req: Request): string => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
};

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, billingAddress, couponCode } = req.body;
  if (!shippingAddress || typeof shippingAddress !== "string") {
    throw new ApiError(400, "shippingAddress is required");
  }

  let proofImageUrl = "";
  if (req.file) {
    try {
      const { uploadToCloudinary } = await import("../utils/cloudinaryUpload.js");
      const uploadResult = (await uploadToCloudinary(req.file.buffer, req.file.originalname, {
        folder: "kingman_orders/proofs"
      })) as { secure_url: string };
      proofImageUrl = uploadResult.secure_url;
    } catch (error) {
      console.error("Payment proof upload failed, continue without proofImageUrl:", error);
    }
  }

  const order = await placeOrder({
    userId: getUserId(req),
    shippingAddress,
    billingAddress,
    couponCode,
    proofImageUrl
  });
  sendSuccess(res, order, "Order placed", 201);
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await listOrdersByUser(getUserId(req));
  sendSuccess(res, orders, "Orders fetched");
});

export const getMyOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrderById(getUserId(req), req.params.orderId);
  sendSuccess(res, order, "Order fetched");
});
