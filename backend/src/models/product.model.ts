import { Schema, model, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: "products"
  }
);

productSchema.index({ name: "text", description: "text" });

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const ProductModel = model("Product", productSchema);
