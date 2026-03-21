import { Schema, model, type InferSchemaType, Types } from "mongoose";

const membershipRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    paymentAmount: { type: Number, default: 29000 },
    paymentTransferNote: { type: String, default: "", trim: true },
    recipientBankBin: { type: String, default: "", trim: true },
    recipientBankName: { type: String, default: "", trim: true },
    recipientAccountNumber: { type: String, default: "", trim: true },
    recipientAccountName: { type: String, default: "", trim: true },
    proofImageUrl: { type: String, required: true, trim: true },
    proofUploadedAt: { type: Date, default: Date.now },
    requestedAt: { type: Date, default: Date.now, index: true },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewNote: { type: String, default: "", trim: true }
  },
  {
    timestamps: true,
    collection: "membership_requests"
  }
);

membershipRequestSchema.index({ userId: 1, status: 1 });

export type MembershipRequestDocument = InferSchemaType<typeof membershipRequestSchema> & {
  userId: Types.ObjectId;
};

export const MembershipRequestModel = model("MembershipRequest", membershipRequestSchema);
