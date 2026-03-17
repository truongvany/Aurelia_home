import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { listInquiries, submitInquiry } from "../services/contact.service.js";

export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "name, email, subject and message are required");
  }

  const inquiry = await submitInquiry({ name, email, subject, message });
  sendSuccess(res, inquiry, "Inquiry submitted", 201);
});

export const getInquiries = asyncHandler(async (_req: Request, res: Response) => {
  const inquiries = await listInquiries();
  sendSuccess(res, inquiries, "Inquiries fetched");
});
