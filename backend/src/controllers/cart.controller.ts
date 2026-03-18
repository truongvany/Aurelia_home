import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity
} from "../services/cart.service.js";

const getUserId = (req: Request): string => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
};

export const fetchCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getCart(getUserId(req));
  sendSuccess(res, cart, "Cart fetched");
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, productVariantId, quantity } = req.body;
  const parsedQuantity = Number(quantity);

  if (!productId || !productVariantId || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw new ApiError(400, "Missing required fields");
  }

  const cart = await addCartItem({
    userId: getUserId(req),
    productId,
    productVariantId,
    quantity: parsedQuantity
  });
  sendSuccess(res, cart, "Item added to cart", 201);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw new ApiError(400, "Missing quantity");
  }

  const cart = await updateCartItemQuantity(
    getUserId(req),
    req.params.itemId,
    parsedQuantity
  );
  sendSuccess(res, cart, "Cart item updated");
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await removeCartItem(getUserId(req), req.params.itemId);
  sendSuccess(res, cart, "Cart item removed");
});

export const clear = asyncHandler(async (req: Request, res: Response) => {
  const cart = await clearCart(getUserId(req));
  sendSuccess(res, cart, "Cart cleared");
});
