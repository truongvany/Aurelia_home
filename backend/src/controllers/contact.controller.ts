import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { listInquiries, submitInquiry, updateInquiryStatus } from "../services/contact.service.js";

export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !phone || !subject) {
    throw new ApiError(400, "name, phone and subject are required");
  }

  const inquiry = await submitInquiry({ name, email, phone, subject, message });
  sendSuccess(res, inquiry, "Inquiry submitted", 201);
});

export const getInquiries = asyncHandler(async (_req: Request, res: Response) => {
  const inquiries = await listInquiries();
  sendSuccess(res, inquiries, "Inquiries fetched");
});

export const patchInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["new", "in_progress", "resolved"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const updated = await updateInquiryStatus(id, status);
  if (!updated) {
    throw new ApiError(404, "Inquiry not found");
  }
  sendSuccess(res, updated, "Inquiry status updated");
});
