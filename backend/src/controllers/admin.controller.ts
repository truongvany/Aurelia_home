import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  archiveAdminProduct,
  createAdminProduct,
  createAdminProductImage,
  getAdminCustomerDetail,
  getAdminDashboardStats,
  getAdminOrderDetail,
  getAdminProductDetail,
  listAdminCustomerOrders,
  listAdminCustomers,
  listAdminOrders,
  listAdminProducts,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminProduct
} from "../services/admin.service.js";

const getActorUserId = (req: Request): string => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
};

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getAdminDashboardStats();
  sendSuccess(res, stats, "Dashboard fetched");
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
  const { name, description, price, categoryId, categorySlug, categoryName, imageUrl, imageUrls, isActive, variant } =
    req.body;

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "name is required");
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, "price must be a valid non-negative number");
  }

  const created = await createAdminProduct(getActorUserId(req), {
    name: name.trim(),
    description: typeof description === "string" ? description : undefined,
    price: numericPrice,
    categoryId: typeof categoryId === "string" ? categoryId : undefined,
    categorySlug: typeof categorySlug === "string" ? categorySlug : undefined,
    categoryName: typeof categoryName === "string" ? categoryName : undefined,
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    imageUrls: Array.isArray(imageUrls) ? imageUrls.filter((item) => typeof item === "string") : undefined,
    isActive: typeof isActive === "boolean" ? isActive : undefined,
    variant:
      variant && typeof variant === "object"
        ? {
            sku: typeof variant.sku === "string" ? variant.sku : undefined,
            size: typeof variant.size === "string" ? variant.size : undefined,
            color: typeof variant.color === "string" ? variant.color : undefined,
            stockQuantity:
              typeof variant.stockQuantity === "number"
                ? variant.stockQuantity
                : variant.stockQuantity
                  ? Number(variant.stockQuantity)
                  : undefined,
            priceAdjustment:
              typeof variant.priceAdjustment === "number"
                ? variant.priceAdjustment
                : variant.priceAdjustment
                  ? Number(variant.priceAdjustment)
                  : undefined
          }
        : undefined
  });

  sendSuccess(res, created, "Product created", 201);
});

export const patchAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, categoryId, categorySlug, categoryName, imageUrl, isActive, variant } =
    req.body;

  const payload = {
    name: typeof name === "string" ? name : undefined,
    description: typeof description === "string" ? description : undefined,
    price:
      typeof price === "number"
        ? price
        : typeof price === "string" && price.trim() !== ""
          ? Number(price)
          : undefined,
    categoryId: typeof categoryId === "string" ? categoryId : undefined,
    categorySlug: typeof categorySlug === "string" ? categorySlug : undefined,
    categoryName: typeof categoryName === "string" ? categoryName : undefined,
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    isActive: typeof isActive === "boolean" ? isActive : undefined,
    variant:
      variant && typeof variant === "object"
        ? {
            sku: typeof variant.sku === "string" ? variant.sku : undefined,
            size: typeof variant.size === "string" ? variant.size : undefined,
            color: typeof variant.color === "string" ? variant.color : undefined,
            stockQuantity:
              typeof variant.stockQuantity === "number"
                ? variant.stockQuantity
                : variant.stockQuantity
                  ? Number(variant.stockQuantity)
                  : undefined,
            priceAdjustment:
              typeof variant.priceAdjustment === "number"
                ? variant.priceAdjustment
                : variant.priceAdjustment
                  ? Number(variant.priceAdjustment)
                  : undefined
          }
        : undefined
  };

  if (typeof payload.price === "number" && (!Number.isFinite(payload.price) || payload.price < 0)) {
    throw new ApiError(400, "price must be a valid non-negative number");
  }

  const updated = await updateAdminProduct(getActorUserId(req), req.params.productId, payload);
  sendSuccess(res, updated, "Product updated");
});

export const deleteAdminProduct = asyncHandler(async (req: Request, res: Response) => {
  const archived = await archiveAdminProduct(getActorUserId(req), req.params.productId);
  sendSuccess(res, archived, "Product archived");
});

export const uploadAdminProductImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "image file is required");
  }

  const normalizedPath = req.file.path.replace(/\\/g, "/");
  const uploadsIndex = normalizedPath.lastIndexOf("uploads/");
  const pathUrl = uploadsIndex >= 0 ? `/${normalizedPath.slice(uploadsIndex)}` : `/uploads/${req.file.filename}`;

  const image = await createAdminProductImage(getActorUserId(req), req.params.productId, {
    pathUrl,
    alt: req.body.alt && typeof req.body.alt === "string" ? req.body.alt : undefined
  });

  sendSuccess(res, image, "Product image uploaded", 201);
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
    search: req.query.search?.toString()
  });

  sendSuccess(res, customers, "Admin customers fetched");
});

export const getAdminCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await getAdminCustomerDetail(req.params.customerId);
  sendSuccess(res, customer, "Admin customer fetched");
});

export const getAdminCustomerOrderList = asyncHandler(async (req: Request, res: Response) => {
  const orders = await listAdminCustomerOrders(req.params.customerId);
  sendSuccess(res, orders, "Admin customer orders fetched");
});
