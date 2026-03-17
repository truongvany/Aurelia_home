import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    }
  },
  {
    timestamps: true,
    collection: "users"
  }
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
