import { ContactInquiryModel } from "../models/contactInquiry.model.js";

interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitInquiry = async (input: ContactInput) =>
  ContactInquiryModel.create(input);

export const listInquiries = async () =>
  ContactInquiryModel.find().sort({ createdAt: -1 }).limit(200);
