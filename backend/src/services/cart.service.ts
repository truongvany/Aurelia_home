import { Types } from "mongoose";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { ApiError } from "../utils/ApiError.js";

interface AddCartItemInput {
  userId: string;
  productId: string;
  productVariantId: string;
  quantity: number;
}

const ensureObjectIds = (ids: string[]) => {
  for (const id of ids) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid identifier");
    }
  }
};

export const getCart = async (userId: string) => {
  ensureObjectIds([userId]);
  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    return { userId, items: [], total: 0 };
  }

  const productIds = [...new Set(cart.items.map((item) => item.productId.toString()))];
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const items = cart.items.map((item) => {
    const product = productMap.get(item.productId.toString());
    return {
      ...item.toObject(),
      productName: product?.name ?? "Unknown product",
      productImageUrl: product?.imageUrl ?? "",
      lineTotal: item.unitPrice * item.quantity
    };
  });

  const total = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { ...cart.toObject(), items, total };
};

export const addCartItem = async (input: AddCartItemInput) => {
  ensureObjectIds([input.userId, input.productId, input.productVariantId]);

  const [product, variant] = await Promise.all([
    ProductModel.findById(input.productId),
    ProductVariantModel.findById(input.productVariantId)
  ]);

  if (!product || !variant) {
    throw new ApiError(404, "Product or variant not found");
  }

  if (variant.stockQuantity < input.quantity) {
    throw new ApiError(422, "Insufficient stock for selected variant");
  }

  const cart =
    (await CartModel.findOne({ userId: input.userId })) ??
    new CartModel({ userId: input.userId, items: [] });

  const existingIndex = cart.items.findIndex(
    (item) => item.productVariantId.toString() === input.productVariantId
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += input.quantity;
  } else {
    cart.items.push({
      productId: product._id,
      productVariantId: variant._id,
      quantity: input.quantity,
      size: variant.size,
      color: variant.color,
      unitPrice: product.price + variant.priceAdjustment
    });
  }

  await cart.save();
  return getCart(input.userId);
};

export const updateCartItemQuantity = async (userId: string, itemId: string, quantity: number) => {
  ensureObjectIds([userId, itemId]);
  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  item.quantity = quantity;
  await cart.save();
  return getCart(userId);
};

export const removeCartItem = async (userId: string, itemId: string) => {
  ensureObjectIds([userId, itemId]);
  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  item.deleteOne();
  await cart.save();
  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  ensureObjectIds([userId]);
  await CartModel.findOneAndUpdate({ userId }, { items: [] }, { upsert: true, new: true });
  return getCart(userId);
};
