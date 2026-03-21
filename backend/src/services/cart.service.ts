import { Types } from "mongoose";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateDiscount, validateCoupon } from "./coupon.service.js";

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
    return {
      userId,
      items: [],
      total: 0,
      appliedCouponCode: "",
      discountAmount: 0,
      finalAmount: 0,
      shippingFee: 0,
      freeShippingApplied: false
    };
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

  const user = await UserModel.findById(userId).select("isMember memberStatus").lean();
  const isActiveMember = Boolean(user?.isMember && user.memberStatus === "active");
  const shippingFee = isActiveMember ? 0 : total > 0 ? 30000 : 0;

  let discountAmount = 0;
  if (cart.appliedCouponCode) {
    try {
      const coupon = await validateCoupon(cart.appliedCouponCode, total, userId);
      discountAmount = calculateDiscount(total, coupon);
    } catch {
      cart.appliedCouponCode = "";
      await cart.save();
    }
  }

  const finalAmount = Math.max(0, total - discountAmount) + shippingFee;

  return {
    ...cart.toObject(),
    items,
    total,
    discountAmount,
    finalAmount,
    shippingFee,
    freeShippingApplied: shippingFee === 0 && total > 0
  };
};

export const addCartItem = async (input: AddCartItemInput) => {
  ensureObjectIds([input.userId, input.productId, input.productVariantId]);

  if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

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
    const nextQuantity = cart.items[existingIndex].quantity + input.quantity;
    if (variant.stockQuantity < nextQuantity) {
      throw new ApiError(422, "Insufficient stock for selected variant");
    }
    cart.items[existingIndex].quantity = nextQuantity;
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

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  const variant = await ProductVariantModel.findById(item.productVariantId);
  if (!variant) {
    throw new ApiError(404, "Product variant not found");
  }

  if (variant.stockQuantity < quantity) {
    throw new ApiError(422, "Insufficient stock for selected variant");
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
  await CartModel.findOneAndUpdate(
    { userId },
    { items: [], appliedCouponCode: "" },
    { upsert: true, new: true }
  );
  return getCart(userId);
};

export const applyCouponToCart = async (userId: string, code: string) => {
  ensureObjectIds([userId]);

  const cart = await CartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(422, "Cart is empty");
  }

  const total = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const coupon = await validateCoupon(code, total, userId);

  cart.appliedCouponCode = coupon.code;
  await cart.save();
  return getCart(userId);
};

export const removeCouponFromCart = async (userId: string) => {
  ensureObjectIds([userId]);

  const cart = await CartModel.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.appliedCouponCode = "";
  await cart.save();
  return getCart(userId);
};
