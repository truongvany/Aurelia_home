import { Types } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/userProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { listUserVouchers } from "./coupon.service.js";

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

export const getMembershipProfile = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await UserModel.findById(userId).select(
    "email firstName lastName role isMember memberStatus memberSince"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isActiveMember = user.isMember && user.memberStatus === "active";

  return {
    user,
    benefits: {
      freeShipping: isActiveMember,
      flexibleSizeExchange: isActiveMember,
      priorityContact: isActiveMember,
      freeAlteration: isActiveMember,
      fashionWarranty: isActiveMember,
      bespokeDesignSupport: isActiveMember
    }
  };
};

export const enrollMembership = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.memberStatus === "active") {
    return getMembershipProfile(userId);
  }

  if (user.memberStatus !== "pending") {
    user.isMember = false;
    user.memberStatus = "pending";
    user.memberSince = null;
    user.membershipRequestedAt = new Date();
    user.membershipReviewedAt = null;
    user.membershipReviewNote = "";
    await user.save();
  }

  return getMembershipProfile(userId);
};

export const getMyVouchers = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  return listUserVouchers(userId);
};
