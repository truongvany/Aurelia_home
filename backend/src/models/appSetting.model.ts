import { Schema, model, type InferSchemaType } from "mongoose";

const appSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    store: {
      name: { type: String, default: "King Man" },
      email: { type: String, default: "support@kingman.vn" },
      currency: { type: String, default: "VND" },
      timezone: { type: String, default: "Asia/Ho_Chi_Minh" },
      taxRate: { type: Number, default: 10 },
      shippingRate: { type: Number, default: 20000 }
    },
    membershipPayment: {
      bankBin: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      accountName: { type: String, default: "" },
      transferPrefix: { type: String, default: "PREMIUM" },
      isActive: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
    collection: "app_settings"
  }
);

export type AppSettingDocument = InferSchemaType<typeof appSettingSchema>;
export const AppSettingModel = model("AppSetting", appSettingSchema);
