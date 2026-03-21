import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  archiveAdminProduct,
  createAdminVoucher,
  createAdminProduct,
  createAdminProductImage,
  deactivateAdminVoucher,
  getAdminCustomerDetail,
  getAdminDashboardStats,
  getAdminSettings,
  listVietnamBanks,
  getAdminOrderDetail,
  getAdminProductDetail,
  listAdminMembershipRequests,
  listAdminVouchers,
  listAdminCustomerOrders,
  listAdminCustomers,
  listAdminOrders,
  listAdminProducts,
  reviewAdminMembershipRequest,
  setAdminProductSizeGuideImage,
  createAdminProductVariantImage,
  deleteAdminProductImage as deleteAdminProductImageService,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminProduct,
  updateAdminCustomerPoints,
  updateAdminSettings
} from "../services/admin.service.js";

const getActorUserId = (req: Request): string => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
};

const parseVariantPayload = (variant: unknown) => {
  if (!variant || typeof variant !== "object") {
    return undefined;
  }

  const value = variant as {
    sku?: unknown;
    size?: unknown;
    color?: unknown;
    imageUrl?: unknown;
    stockQuantity?: unknown;
    priceAdjustment?: unknown;
  };

  return {
    sku: typeof value.sku === "string" ? value.sku : undefined,
    size: typeof value.size === "string" ? value.size : undefined,
    color: typeof value.color === "string" ? value.color : undefined,
    imageUrl: typeof value.imageUrl === "string" ? value.imageUrl : undefined,
    stockQuantity:
      typeof value.stockQuantity === "number"
        ? value.stockQuantity
        : value.stockQuantity
          ? Number(value.stockQuantity)
          : undefined,
    priceAdjustment:
      typeof value.priceAdjustment === "number"
        ? value.priceAdjustment
        : value.priceAdjustment
          ? Number(value.priceAdjustment)
          : undefined
  };
};

const parseVariantsPayload = (variants: unknown) => {
  if (!Array.isArray(variants)) {
    return undefined;
  }

  return variants
    .map((item) => parseVariantPayload(item))
    .filter((item): item is NonNullable<ReturnType<typeof parseVariantPayload>> => Boolean(item));
};

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getAdminDashboardStats();
  sendSuccess(res, stats, "Dashboard fetched");
});

export const getAdminStoreSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getAdminSettings();
  sendSuccess(res, settings, "Admin settings fetched");
});

export const getAdminBanks = asyncHandler(async (_req: Request, res: Response) => {
  const banks = await listVietnamBanks();
  sendSuccess(res, banks, "Admin banks fetched");
});

export const patchAdminStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const updated = await updateAdminSettings(getActorUserId(req), {
    store: req.body.store,
    membershipPayment: req.body.membershipPayment
  });
  sendSuccess(res, updated, "Admin settings updated");
});

export const getAdminProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await listAdminProducts({
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search?.toString(),
    category: req.query.category?.toString(),
    status: req.query.status as "active" | "inactive" | undefined
  });

  sendSuccess(res, products, "Admin products fetched");
});

export const getAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await getAdminProductDetail(req.params.productId);
  sendSuccess(res, product, "Admin product fetched");
});

export const postAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    discountPercent,
    categoryId,
    categorySlug,
    categoryName,
    imageUrl,
    sizeGuideImageUrl,
    imageUrls,
    isActive,
    variant,
    variants
  } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new ApiError(400, "Product name is required and cannot be empty");
  }

  if (!categoryId && !categorySlug && !categoryName) {
    throw new ApiError(400, "categoryId, categorySlug, or categoryName is required");
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, "Price must be a valid non-negative number");
  }

  const created = await createAdminProduct(getActorUserId(req), {
    name: name.trim(),
    description: typeof description === "string" ? description : undefined,
    price: numericPrice,
    discountPercent: typeof discountPercent === "number" ? discountPercent : (typeof discountPercent === "string" && discountPercent.trim() !== "" ? Number(discountPercent) : 0),
    categoryId: typeof categoryId === "string" ? categoryId : undefined,
    categorySlug: typeof categorySlug === "string" ? categorySlug : undefined,
    categoryName: typeof categoryName === "string" ? categoryName : undefined,
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    sizeGuideImageUrl: typeof sizeGuideImageUrl === "string" ? sizeGuideImageUrl : undefined,
    imageUrls: Array.isArray(imageUrls) ? imageUrls.filter((item) => typeof item === "string") : undefined,
    isActive: typeof isActive === "boolean" ? isActive : true,
    variant: parseVariantPayload(variant),
    variants: parseVariantsPayload(variants)
  });

  sendSuccess(res, created, "Product created successfully", 201);
});

export const patchAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    discountPercent,
    categoryId,
    categorySlug,
    categoryName,
    imageUrl,
    sizeGuideImageUrl,
    imageUrls,
    isActive,
    variant,
    variants
  } = req.body;

  const payload = {
    name: typeof name === "string" && name.trim().length > 0 ? name : undefined,
    description: typeof description === "string" ? description : undefined,
    price:
      typeof price === "number"
        ? price
        : typeof price === "string" && price.trim() !== ""
          ? Number(price)
          : undefined,
    discountPercent:
      typeof discountPercent === "number"
        ? discountPercent
        : typeof discountPercent === "string" && discountPercent.trim() !== ""
          ? Number(discountPercent)
          : undefined,
    categoryId: typeof categoryId === "string" ? categoryId : undefined,
    categorySlug: typeof categorySlug === "string" ? categorySlug : undefined,
    categoryName: typeof categoryName === "string" ? categoryName : undefined,
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    sizeGuideImageUrl: typeof sizeGuideImageUrl === "string" ? sizeGuideImageUrl : undefined,
    imageUrls: Array.isArray(imageUrls) ? imageUrls.filter((item) => typeof item === "string") : undefined,
    isActive: typeof isActive === "boolean" ? isActive : undefined,
    variant: parseVariantPayload(variant),
    variants: parseVariantsPayload(variants)
  };

  if (typeof payload.price === "number" && (!Number.isFinite(payload.price) || payload.price < 0)) {
    throw new ApiError(400, "Price must be a valid non-negative number");
  }

  const updated = await updateAdminProduct(getActorUserId(req), req.params.productId, payload);
  sendSuccess(res, updated, "Product updated successfully");
});

export const deleteAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await archiveAdminProduct(getActorUserId(req), req.params.productId);
  sendSuccess(res, deleted, "Product deleted successfully");
});

export const deleteAdminProductImage = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await deleteAdminProductImageService(getActorUserId(req), req.params.productId, req.params.imageId);
  sendSuccess(res, deleted, "Product image deleted successfully");
});

export const uploadAdminProductImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "image file is required");
  }

  const { uploadToCloudinary } = await import("../utils/cloudinaryUpload.js");

  // Upload to Cloudinary
  const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, {
    folder: "kingman_products/gallery"
  }) as any;

  const image = await createAdminProductImage(getActorUserId(req), req.params.productId, {
    pathUrl: cloudinaryResult.secure_url,
    alt: req.body.alt && typeof req.body.alt === "string" ? req.body.alt : undefined
  });

  sendSuccess(res, image, "Product image uploaded", 201);
});

export const uploadAdminProductVariantImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "image file is required");
  }

  const { uploadToCloudinary } = await import("../utils/cloudinaryUpload.js");

  // Upload to Cloudinary
  const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, {
    folder: "kingman_products/variants"
  }) as any;

  const image = await createAdminProductVariantImage(getActorUserId(req), req.params.productId, {
    pathUrl: cloudinaryResult.secure_url,
    alt: req.body.alt && typeof req.body.alt === "string" ? req.body.alt : undefined
  });

  sendSuccess(res, image, "Product variant image uploaded", 201);
});

export const uploadAdminProductSizeGuideImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "image file is required");
  }

  const { uploadToCloudinary } = await import("../utils/cloudinaryUpload.js");

  // Upload to Cloudinary
  const cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, {
    folder: "kingman_products/size_guides"
  }) as any;

  const updated = await setAdminProductSizeGuideImage(getActorUserId(req), req.params.productId, {
    pathUrl: cloudinaryResult.secure_url
  });

  sendSuccess(res, updated, "Size guide image uploaded", 201);
});

export const getAdminOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await listAdminOrders({
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search?.toString(),
    status: req.query.status as "pending" | "paid" | "shipped" | "delivered" | "cancelled" | undefined,
    paymentStatus: req.query.paymentStatus as "pending" | "paid" | "failed" | undefined
  });

  sendSuccess(res, orders, "Admin orders fetched");
});

export const getAdminOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await getAdminOrderDetail(req.params.orderId);
  sendSuccess(res, order, "Admin order fetched");
});

export const patchAdminOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || typeof status !== "string") {
    throw new ApiError(400, "status is required");
  }

  const updated = await updateAdminOrderStatus(
    getActorUserId(req),
    req.params.orderId,
    status as "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  );

  sendSuccess(res, updated, "Order status updated");
});

export const patchAdminPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { paymentStatus } = req.body;
  if (!paymentStatus || typeof paymentStatus !== "string") {
    throw new ApiError(400, "paymentStatus is required");
  }

  const updated = await updateAdminPaymentStatus(
    getActorUserId(req),
    req.params.orderId,
    paymentStatus as "pending" | "paid" | "failed"
  );

  sendSuccess(res, updated, "Payment status updated");
});

export const getAdminCustomers = asyncHandler(async (req: Request, res: Response) => {
  const customers = await listAdminCustomers({
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search?.toString(),
    memberStatus: req.query.memberStatus as "all" | "member" | "non-member" | undefined
  });

  sendSuccess(res, customers, "Admin customers fetched");
});

export const getAdminCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await getAdminCustomerDetail(req.params.customerId);
  sendSuccess(res, customer, "Admin customer fetched");
});

export const patchAdminCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { points, tier } = req.body;
  const numericPoints = typeof points === 'number' ? points : (typeof points === 'string' ? Number(points) : undefined);
  const validTier = typeof tier === 'string' ? tier : undefined;

  const updated = await updateAdminCustomerPoints(getActorUserId(req), req.params.customerId, numericPoints, validTier);
  sendSuccess(res, updated, "Customer updated successfully");
});

export const getAdminCustomerOrderList = asyncHandler(async (req: Request, res: Response) => {
  const orders = await listAdminCustomerOrders(req.params.customerId);
  sendSuccess(res, orders, "Admin customer orders fetched");
});

export const getAdminMembershipRequests = asyncHandler(async (req: Request, res: Response) => {
  const data = await listAdminMembershipRequests({
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search?.toString(),
    status: req.query.status as "inactive" | "pending" | "active" | undefined
  });

  sendSuccess(res, data, "Admin membership requests fetched");
});

export const patchAdminMembershipRequest = asyncHandler(async (req: Request, res: Response) => {
  const action = req.params.action;
  if (action !== "approve" && action !== "reject") {
    throw new ApiError(400, "action must be approve or reject");
  }

  const updated = await reviewAdminMembershipRequest(
    getActorUserId(req),
    req.params.userId,
    action,
    typeof req.body.note === "string" ? req.body.note : undefined
  );

  sendSuccess(res, updated, `Membership request ${action}d`);
});

export const getAdminVouchers = asyncHandler(async (req: Request, res: Response) => {
  const isActiveQuery = req.query.isActive?.toString();
  const isActive =
    isActiveQuery === undefined
      ? undefined
      : isActiveQuery === "true"
        ? true
        : isActiveQuery === "false"
          ? false
          : undefined;

  const data = await listAdminVouchers({
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search?.toString(),
    source: req.query.source as "generic" | "welcome" | "membership" | undefined,
    isActive
  });

  sendSuccess(res, data, "Admin vouchers fetched");
});

export const postAdminVoucher = asyncHandler(async (req: Request, res: Response) => {
  const { code, discountType, discountValue, minOrderAmount, expiresAt, source, assignedUserId, maxUsesPerUser } =
    req.body;

  if (!code || typeof code !== "string") {
    throw new ApiError(400, "code is required");
  }

  if (discountType !== "percent" && discountType !== "fixed") {
    throw new ApiError(400, "discountType must be percent or fixed");
  }

  const numericDiscountValue = Number(discountValue);
  if (!Number.isFinite(numericDiscountValue) || numericDiscountValue <= 0) {
    throw new ApiError(400, "discountValue must be a positive number");
  }

  if (!expiresAt || typeof expiresAt !== "string") {
    throw new ApiError(400, "expiresAt is required");
  }

  const voucher = await createAdminVoucher(getActorUserId(req), {
    code,
    discountType,
    discountValue: numericDiscountValue,
    minOrderAmount: Number(minOrderAmount ?? 0),
    expiresAt,
    source,
    assignedUserId: typeof assignedUserId === "string" ? assignedUserId : undefined,
    maxUsesPerUser: Number(maxUsesPerUser ?? 1)
  });

  sendSuccess(res, voucher, "Voucher created", 201);
});

export const patchAdminVoucherDeactivate = asyncHandler(async (req: Request, res: Response) => {
  const voucher = await deactivateAdminVoucher(getActorUserId(req), req.params.voucherId);
  sendSuccess(res, voucher, "Voucher deactivated");
});
