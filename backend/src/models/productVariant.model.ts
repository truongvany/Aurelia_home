import { Schema, model, type InferSchemaType } from "mongoose";

const productVariantSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    sku: { type: String, required: true, unique: true, trim: true },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    stockQuantity: { type: Number, default: 0, min: 0 },
    priceAdjustment: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: "product_variants"
  }
);

export type ProductVariantDocument = InferSchemaType<typeof productVariantSchema>;
export const ProductVariantModel = model("ProductVariant", productVariantSchema);
