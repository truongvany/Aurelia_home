import { Schema, model, type InferSchemaType } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  {
    timestamps: true,
    collection: "wishlists"
  }
);

export type WishlistDocument = InferSchemaType<typeof wishlistSchema>;
export const WishlistModel = model("Wishlist", wishlistSchema);
