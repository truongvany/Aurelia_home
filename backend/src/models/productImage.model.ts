import { Schema, model, type InferSchemaType } from "mongoose";

const productImageSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: "product_images"
  }
);

export type ProductImageDocument = InferSchemaType<typeof productImageSchema>;
export const ProductImageModel = model("ProductImage", productImageSchema);
