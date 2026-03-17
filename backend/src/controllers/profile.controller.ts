import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getProfile, updateProfile, upsertStyleProfile } from "../services/profile.service.js";

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
