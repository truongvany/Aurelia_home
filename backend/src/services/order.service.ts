import { Types } from "mongoose";
import { CartModel } from "../models/cart.model.js";
import { OrderModel } from "../models/order.model.js";
import { PaymentModel } from "../models/payment.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { ApiError } from "../utils/ApiError.js";

interface PlaceOrderInput {
  userId: string;
  shippingAddress: string;
  billingAddress?: string;
}

export const placeOrder = async (input: PlaceOrderInput) => {
  if (!Types.ObjectId.isValid(input.userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const cart = await CartModel.findOne({ userId: input.userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(422, "Cart is empty");
  }

  const snapshots = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const [product, variant] = await Promise.all([
      ProductModel.findById(item.productId),
      ProductVariantModel.findById(item.productVariantId)
    ]);

    if (!product || !variant) {
      throw new ApiError(422, "Invalid product reference in cart");
    }

    if (variant.stockQuantity < item.quantity) {
      throw new ApiError(422, `Insufficient stock for SKU ${variant.sku}`);
    }

    variant.stockQuantity -= item.quantity;
    await variant.save();

    snapshots.push({
      productId: item.productId,
      productVariantId: item.productVariantId,
      name: product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      size: item.size,
      color: item.color
    });

    totalAmount += item.unitPrice * item.quantity;
  }

  const order = await OrderModel.create({
    userId: input.userId,
    status: "paid",
    totalAmount,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress ?? input.shippingAddress,
    items: snapshots
  });

  await PaymentModel.create({
    orderId: order._id,
    userId: input.userId,
    amount: totalAmount,
    status: "paid",
    provider: "mock"
  });

  cart.items.splice(0, cart.items.length);
  await cart.save();

  return order;
};

export const listOrdersByUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  return OrderModel.find({ userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (userId: string, orderId: string) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await OrderModel.findOne({ _id: orderId, userId });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};
