import { Schema, model, type InferSchemaType } from "mongoose";

const contactInquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new"
    }
  },
  {
    timestamps: true,
    collection: "contact_inquiries"
  }
);

export type ContactInquiryDocument = InferSchemaType<typeof contactInquirySchema>;
export const ContactInquiryModel = model("ContactInquiry", contactInquirySchema);
