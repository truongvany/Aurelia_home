import { Schema, model, type InferSchemaType } from "mongoose";

const userProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bodyType: { type: String },
    stylePreference: { type: String },
    heightCm: { type: Number },
    weightKg: { type: Number },
    skinTone: { type: String }
  },
  {
    timestamps: true,
    collection: "user_profiles"
  }
);

export type UserProfileDocument = InferSchemaType<typeof userProfileSchema>;
export const UserProfileModel = model("UserProfile", userProfileSchema);
