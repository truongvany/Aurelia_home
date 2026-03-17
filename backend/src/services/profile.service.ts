import { Types } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/userProfile.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getProfile = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const [user, profile] = await Promise.all([
    UserModel.findById(userId).select("-passwordHash"),
    UserProfileModel.findOne({ userId })
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { user, profile };
};

export const updateProfile = async (
  userId: string,
  payload: { firstName?: string; lastName?: string; phone?: string }
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true
  }).select("-passwordHash");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const upsertStyleProfile = async (
  userId: string,
  payload: {
    bodyType?: string;
    stylePreference?: string;
    heightCm?: number;
    weightKg?: number;
    skinTone?: string;
  }
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  return UserProfileModel.findOneAndUpdate(
    { userId },
    { $set: payload },
    { upsert: true, new: true }
  );
};
