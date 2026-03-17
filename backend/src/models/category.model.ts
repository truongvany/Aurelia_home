import { Schema, model, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null }
  },
  {
    timestamps: true,
    collection: "categories"
  }
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export const CategoryModel = model("Category", categorySchema);
