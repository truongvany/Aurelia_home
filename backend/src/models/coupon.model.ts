import { Schema, model, type InferSchemaType } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ["generic", "welcome", "membership"],
      default: "generic"
    },
    assignedUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    maxUsesPerUser: { type: Number, default: 1, min: 1 },
    usedByUserIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: "coupons"
  }
);

export type CouponDocument = InferSchemaType<typeof couponSchema>;
export const CouponModel = model("Coupon", couponSchema);
