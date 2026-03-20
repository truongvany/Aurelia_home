import { CouponModel, type CouponDocument } from "../models/coupon.model.js";
import { ApiError } from "../utils/ApiError.js";

export const validateCoupon = async (code: string, orderAmount: number, userId: string) => {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    throw new ApiError(400, "Coupon code is required");
  }

  const coupon = await CouponModel.findOne({ code: normalized, isActive: true });
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  if (coupon.assignedUserId && coupon.assignedUserId.toString() !== userId) {
    throw new ApiError(403, "Coupon is not assigned to this account");
  }

  if (coupon.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "Coupon has expired");
  }

  if (orderAmount < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount is ${coupon.minOrderAmount}`);
  }

  const usedByUserIds = Array.isArray(coupon.usedByUserIds) ? coupon.usedByUserIds : [];
  const maxUsesPerUser =
    typeof coupon.maxUsesPerUser === "number" && coupon.maxUsesPerUser > 0
      ? coupon.maxUsesPerUser
      : 1;

  const usedCount = usedByUserIds.filter((id) => id.toString() === userId).length;
  if (usedCount >= maxUsesPerUser) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  return coupon;
};

export const calculateDiscount = (amount: number, coupon: CouponDocument) => {
  if (coupon.discountType === "percent") {
    return Math.min(amount, (amount * coupon.discountValue) / 100);
  }

  return Math.min(amount, coupon.discountValue);
};

export const markCouponUsedByUser = async (couponId: string, userId: string) => {
  await CouponModel.updateOne(
    { _id: couponId },
    {
      $push: { usedByUserIds: userId }
    }
  );
};

export const listUserVouchers = async (userId: string) => {
  const coupons = await CouponModel.find({
    isActive: true,
    $or: [{ assignedUserId: userId }, { assignedUserId: null }]
  }).sort({ createdAt: -1 });

  return coupons.map((coupon) => ({
    _id: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minOrderAmount: coupon.minOrderAmount,
    source: coupon.source ?? "generic",
    expiresAt: coupon.expiresAt,
    isActive: coupon.isActive,
    isExpired: coupon.expiresAt.getTime() < Date.now(),
    usedCount: (Array.isArray(coupon.usedByUserIds) ? coupon.usedByUserIds : []).filter(
      (id) => id.toString() === userId
    ).length,
    maxUsesPerUser:
      typeof coupon.maxUsesPerUser === "number" && coupon.maxUsesPerUser > 0
        ? coupon.maxUsesPerUser
        : 1
  }));
};
