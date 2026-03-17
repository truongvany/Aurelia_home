import { Schema, model, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productVariantId: { type: Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 }
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], default: [] }
  },
  {
    timestamps: true,
    collection: "carts"
  }
);

export type CartDocument = InferSchemaType<typeof cartSchema>;
export const CartModel = model("Cart", cartSchema);
