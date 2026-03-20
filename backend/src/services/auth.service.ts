import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/userProfile.model.js";
import { RefreshTokenModel } from "../models/refreshToken.model.js";
import { CouponModel } from "../models/coupon.model.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/token.js";

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const getRefreshTokenExpiryDate = (): Date => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  return expires;
};

export const registerUser = async (input: RegisterInput) => {
  const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    email: input.email.toLowerCase(),
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    role: "customer"
  });

  await UserProfileModel.create({ userId: user._id });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  const shortId = user._id.toString().slice(-6).toUpperCase();

  await CouponModel.create({
    code: `WELCOME-${shortId}`,
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 0,
    source: "welcome",
    assignedUserId: user._id,
    maxUsesPerUser: 1,
    expiresAt,
    isActive: true
  });

  return createAuthPayload(
    user._id.toString(),
    user.email,
    user.role,
    user.isMember,
    user.memberStatus
  );
};

export const loginUser = async (input: LoginInput) => {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  return createAuthPayload(
    user._id.toString(),
    user.email,
    user.role,
    user.isMember,
    user.memberStatus
  );
};

export const refreshAuthToken = async (refreshToken: string) => {
  const payload = verifyToken(refreshToken);
  const tokenDoc = await RefreshTokenModel.findOne({ token: refreshToken });
  if (!tokenDoc) {
    throw new ApiError(401, "Invalid refresh token");
  }

  await RefreshTokenModel.deleteOne({ _id: tokenDoc._id });
  return createAuthPayload(
    payload.userId,
    payload.email,
    payload.role,
    payload.isMember,
    payload.memberStatus
  );
};

export const getCurrentUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await UserModel.findById(userId).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const createAuthPayload = async (
  userId: string,
  email: string,
  role: "customer" | "admin",
  isMember?: boolean,
  memberStatus?: "inactive" | "pending" | "active"
) => {
  const payload = { userId, email, role, isMember, memberStatus };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshTokenModel.create({
    userId,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiryDate()
  });

  return {
    accessToken,
    refreshToken,
    user: await UserModel.findById(userId).select("-passwordHash")
  };
};
