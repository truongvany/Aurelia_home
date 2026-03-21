import { Types } from "mongoose";
import { AppSettingModel } from "../models/appSetting.model.js";
import { MembershipRequestModel } from "../models/membershipRequest.model.js";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/userProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { listUserVouchers } from "./coupon.service.js";

const getGlobalSettings = async () => {
  const existing = await AppSettingModel.findOne({ key: "global" });
  if (existing) {
    return existing;
  }

  return AppSettingModel.create({ key: "global" });
};

const resolveMembershipPayment = (settings: any) => ({
  bankBin: settings?.membershipPayment?.bankBin ?? "",
  bankName: settings?.membershipPayment?.bankName ?? "",
  accountNumber: settings?.membershipPayment?.accountNumber ?? "",
  accountName: settings?.membershipPayment?.accountName ?? "",
  transferPrefix: settings?.membershipPayment?.transferPrefix ?? "PREMIUM",
  isActive: settings?.membershipPayment?.isActive ?? true
});

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
  const latestRequest = await MembershipRequestModel.findOne({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  return {
    user,
    benefits: {
      freeShipping: isActiveMember,
      flexibleSizeExchange: isActiveMember,
      priorityContact: isActiveMember,
      freeAlteration: isActiveMember,
      fashionWarranty: isActiveMember,
      bespokeDesignSupport: isActiveMember
    },
    latestRequest: latestRequest
      ? {
          _id: latestRequest._id,
          fullName: latestRequest.fullName,
          email: latestRequest.email,
          phone: latestRequest.phone,
          address: latestRequest.address,
          status: latestRequest.status,
          paymentAmount: latestRequest.paymentAmount,
          paymentTransferNote: latestRequest.paymentTransferNote,
          proofImageUrl: latestRequest.proofImageUrl,
          requestedAt: latestRequest.requestedAt,
          reviewedAt: latestRequest.reviewedAt,
          reviewNote: latestRequest.reviewNote
        }
      : null
  };
};

export const getMembershipPaymentConfig = async () => {
  const settings = await getGlobalSettings();
  const membershipPayment = resolveMembershipPayment(settings);

  return {
    bankBin: membershipPayment.bankBin ?? "",
    bankName: membershipPayment.bankName ?? "",
    accountNumber: membershipPayment.accountNumber ?? "",
    accountName: membershipPayment.accountName ?? "",
    transferPrefix: membershipPayment.transferPrefix ?? "PREMIUM",
    isActive: membershipPayment.isActive ?? true,
    amount: 29000
  };
};

export const enrollMembership = async (
  userId: string,
  payload: {
    fullName?: string;
    phone?: string;
    address?: string;
    paymentTransferNote?: string;
    proofImageUrl?: string;
  }
) => {
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

  const fullName = payload.fullName?.trim();
  const phone = payload.phone?.trim();
  const proofImageUrl = payload.proofImageUrl?.trim();

  if (!fullName) {
    throw new ApiError(400, "fullName is required");
  }

  if (!phone) {
    throw new ApiError(400, "phone is required");
  }

  if (!proofImageUrl) {
    throw new ApiError(400, "proof image is required");
  }

  const settings = await getGlobalSettings();
  const membershipPayment = resolveMembershipPayment(settings);

  if (!membershipPayment.isActive) {
    throw new ApiError(422, "Membership payment is currently disabled");
  }

  if (!membershipPayment.bankBin || !membershipPayment.accountNumber || !membershipPayment.accountName) {
    throw new ApiError(422, "Membership payment settings are not configured by admin");
  }

  user.phone = phone;
  user.isMember = false;
  user.memberStatus = "pending";
  user.memberSince = null;
  user.membershipRequestedAt = new Date();
  user.membershipReviewedAt = null;
  user.membershipReviewNote = "";
  await user.save();

  const pendingRequest = await MembershipRequestModel.findOne({
    userId: user._id,
    status: "pending"
  }).sort({ createdAt: -1 });

  const paymentTransferNote =
    payload.paymentTransferNote?.trim() || `${membershipPayment.transferPrefix ?? "PREMIUM"} ${user.email}`;

  const requestPayload = {
    fullName,
    email: user.email,
    phone,
    address: payload.address?.trim() ?? "",
    paymentAmount: 29000,
    paymentTransferNote,
    recipientBankBin: membershipPayment.bankBin,
    recipientBankName: membershipPayment.bankName ?? "",
    recipientAccountNumber: membershipPayment.accountNumber,
    recipientAccountName: membershipPayment.accountName,
    proofImageUrl,
    proofUploadedAt: new Date(),
    requestedAt: new Date(),
    reviewNote: ""
  };

  if (pendingRequest) {
    pendingRequest.fullName = requestPayload.fullName;
    pendingRequest.email = requestPayload.email;
    pendingRequest.phone = requestPayload.phone;
    pendingRequest.address = requestPayload.address;
    pendingRequest.paymentAmount = requestPayload.paymentAmount;
    pendingRequest.paymentTransferNote = requestPayload.paymentTransferNote;
    pendingRequest.recipientBankBin = requestPayload.recipientBankBin;
    pendingRequest.recipientBankName = requestPayload.recipientBankName;
    pendingRequest.recipientAccountNumber = requestPayload.recipientAccountNumber;
    pendingRequest.recipientAccountName = requestPayload.recipientAccountName;
    pendingRequest.proofImageUrl = requestPayload.proofImageUrl;
    pendingRequest.proofUploadedAt = requestPayload.proofUploadedAt;
    pendingRequest.requestedAt = requestPayload.requestedAt;
    pendingRequest.reviewedAt = null;
    pendingRequest.reviewedBy = null;
    pendingRequest.reviewNote = "";
    pendingRequest.status = "pending";
    await pendingRequest.save();
  } else {
    await MembershipRequestModel.create({
      userId: user._id,
      ...requestPayload,
      status: "pending"
    });
  }

  return getMembershipProfile(userId);
};

export const getMyVouchers = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  return listUserVouchers(userId);
};
