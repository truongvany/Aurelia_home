import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    customerCode: { type: String, unique: true, sparse: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    isMember: { type: Boolean, default: false },
    memberStatus: {
      type: String,
      enum: ["inactive", "pending", "active"],
      default: "inactive"
    },
    memberSince: { type: Date, default: null },
    membershipRequestedAt: { type: Date, default: null },
    membershipReviewedAt: { type: Date, default: null },
    membershipReviewNote: { type: String, default: "" },
    points: { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ["Mới", "Bạc", "Vàng", "Kim cương"],
      default: "Mới"
    }
  },
  {
    timestamps: true,
    collection: "users"
  }
);

userSchema.pre("save", function (next) {
  if (this.isNew && !this.customerCode) {
    this.customerCode = "KM-" + this._id.toString().slice(-6).toUpperCase();
  }
  next();
});

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
