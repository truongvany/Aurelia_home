import { Schema, model, type InferSchemaType } from "mongoose";

const orderItemSnapshotSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productVariantId: { type: Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    size: { type: String, required: true },
    color: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    items: { type: [orderItemSnapshotSchema], default: [] }
  },
  {
    timestamps: true,
    collection: "orders"
  }
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;
export const OrderModel = model("Order", orderSchema);
