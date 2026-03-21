import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  enrollMembership,
  getMembershipPaymentConfig,
  getMembershipProfile,
  getMyVouchers,
  getProfile,
  updateProfile,
  upsertStyleProfile,
  exchangePointsForVoucher
} from "../services/profile.service.js";

const getUserId = (req: Request): string => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
};

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await getProfile(getUserId(req));
  sendSuccess(res, profile, "Profile fetched");
});

export const patchMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateProfile(getUserId(req), {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone
  });
  sendSuccess(res, user, "Profile updated");
});

export const patchStyleProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await upsertStyleProfile(getUserId(req), {
    bodyType: req.body.bodyType,
    stylePreference: req.body.stylePreference,
    heightCm: req.body.heightCm,
    weightKg: req.body.weightKg,
    skinTone: req.body.skinTone
  });
  sendSuccess(res, profile, "Style profile updated");
});

export const getMyMembership = asyncHandler(async (req: Request, res: Response) => {
  const membership = await getMembershipProfile(getUserId(req));
  sendSuccess(res, membership, "Membership fetched");
});

export const getMyMembershipPaymentConfig = asyncHandler(async (_req: Request, res: Response) => {
  const config = await getMembershipPaymentConfig();
  sendSuccess(res, config, "Membership payment config fetched");
});

export const joinMembership = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "proofImage file is required");
  }

  const { uploadToCloudinary } = await import("../utils/cloudinaryUpload.js");
  const uploadResult = (await uploadToCloudinary(req.file.buffer, req.file.originalname, {
    folder: "kingman_membership/proofs"
  })) as { secure_url: string };

  const membership = await enrollMembership(getUserId(req), {
    fullName: typeof req.body.fullName === "string" ? req.body.fullName : undefined,
    phone: typeof req.body.phone === "string" ? req.body.phone : undefined,
    address: typeof req.body.address === "string" ? req.body.address : undefined,
    paymentTransferNote:
      typeof req.body.paymentTransferNote === "string" ? req.body.paymentTransferNote : undefined,
    proofImageUrl: uploadResult.secure_url
  });

  sendSuccess(res, membership, "Membership request submitted");
});

export const getVouchers = asyncHandler(async (req: Request, res: Response) => {
  const vouchers = await getMyVouchers(getUserId(req));
  sendSuccess(res, vouchers, "Vouchers fetched");
});

export const exchangeVoucher = asyncHandler(async (req: Request, res: Response) => {
  const { exchangeType } = req.body;
  if (!exchangeType) {
    throw new ApiError(400, "exchangeType is required");
  }
  
  const coupon = await exchangePointsForVoucher(getUserId(req), exchangeType);
  sendSuccess(res, coupon, "Đổi điểm thành công");
});
