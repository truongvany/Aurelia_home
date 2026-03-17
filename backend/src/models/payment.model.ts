import { Schema, model, type InferSchemaType } from "mongoose";

const paymentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, default: "mock" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    transactionRef: { type: String, default: "" }
  },
  {
    timestamps: true,
    collection: "payments"
  }
);

export type PaymentDocument = InferSchemaType<typeof paymentSchema>;
export const PaymentModel = model("Payment", paymentSchema);
