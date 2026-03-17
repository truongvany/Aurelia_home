import { Schema, model, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    comment: { type: String, default: "" },
    isVerifiedPurchase: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: "reviews"
  }
);

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export type ReviewDocument = InferSchemaType<typeof reviewSchema>;
export const ReviewModel = model("Review", reviewSchema);
