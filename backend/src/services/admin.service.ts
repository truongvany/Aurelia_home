import { Types } from "mongoose";
import { USER_ROLES } from "../constants/roles.js";
import { AuditLogModel } from "../models/auditLog.model.js";
import { CategoryModel } from "../models/category.model.js";
import { OrderModel } from "../models/order.model.js";
import { PaymentModel } from "../models/payment.model.js";
import { ProductImageModel } from "../models/productImage.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const LOW_STOCK_THRESHOLD = 5;

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface AdminListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

interface AdminProductListQuery extends AdminListQuery {
  category?: string;
  status?: "active" | "inactive";
}

interface AdminOrderListQuery extends AdminListQuery {
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentStatus?: "pending" | "paid" | "failed";
}

interface ProductVariantInput {
  sku?: string;
  size?: string;
  color?: string;
  stockQuantity?: number;
  priceAdjustment?: number;
}

interface CreateAdminProductInput {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isActive?: boolean;
  variant?: ProductVariantInput;
}

interface UpdateAdminProductInput {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isActive?: boolean;
  variant?: ProductVariantInput;
}

const toPagination = (query: AdminListQuery) => {
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const toPaginationMeta = (page: number, limit: number, total: number): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit))
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueProductSlug = async (name: string, ignoreProductId?: string) => {
  const base = slugify(name);
  const fallbackBase = base || `product-${Date.now()}`;

  let candidate = fallbackBase;
  let index = 1;

  while (true) {
    const existing = await ProductModel.findOne({ slug: candidate }).select("_id").lean();
    if (!existing || existing._id.toString() === ignoreProductId) {
      return candidate;
    }

    candidate = `${fallbackBase}-${index}`;
    index += 1;
  }
};

const ensureObjectId = (id: string, label: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
};

const resolveCategoryId = async (input: {
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
}) => {
  if (input.categoryId) {
    ensureObjectId(input.categoryId, "category id");

    const categoryById = await CategoryModel.findById(input.categoryId).select("_id").lean();
    if (!categoryById) {
      throw new ApiError(404, "Category not found");
    }

    return categoryById._id;
  }

  if (input.categorySlug) {
    const bySlug = await CategoryModel.findOne({ slug: input.categorySlug }).select("_id").lean();
    if (!bySlug) {
      throw new ApiError(404, "Category not found");
    }

    return bySlug._id;
  }

  if (input.categoryName) {
    const byName = await CategoryModel.findOne({ name: input.categoryName }).select("_id").lean();
    if (!byName) {
      throw new ApiError(404, "Category not found");
    }

    return byName._id;
  }

  return null;
};

const writeAudit = async (
  actorUserId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata: Record<string, unknown>
) => {
  if (!Types.ObjectId.isValid(actorUserId)) {
    return;
  }

  await AuditLogModel.create({ actorUserId, action, targetType, targetId, metadata });
};

export const listAdminProducts = async (query: AdminProductListQuery) => {
  const { page, limit, skip } = toPagination(query);
  const filter: Record<string, unknown> = {};

  if (query.search?.trim()) {
    const regex = new RegExp(query.search.trim(), "i");
    filter.$or = [{ name: regex }, { slug: regex }, { description: regex }];
  }

  // Always show all products (both active and inactive) in admin view
  if (query.status === "active") {
    filter.isActive = true;
  } else if (query.status === "inactive") {
    filter.isActive = false;
  }

  if (query.category?.trim()) {
    const category = await CategoryModel.findOne({
      $or: [{ slug: query.category.trim() }, { name: query.category.trim() }]
    })
      .select("_id")
      .lean();

    if (!category) {
      return {
        items: [],
        meta: toPaginationMeta(page, limit, 0)
      };
    }

    filter.categoryId = category._id;
  }

  const [total, products] = await Promise.all([
    ProductModel.countDocuments(filter),
    ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
  ]);

  const categoryIds = [...new Set(products.map((item) => item.categoryId.toString()))];
  const productIds = products.map((item) => item._id);

  const [categories, variants] = await Promise.all([
    CategoryModel.find({ _id: { $in: categoryIds } }).select("_id name slug").lean(),
    ProductVariantModel.find({ productId: { $in: productIds } }).lean()
  ]);

  const categoryMap = new Map(categories.map((item) => [item._id.toString(), item]));
  const variantMap = new Map<string, typeof variants>();

  for (const variant of variants) {
    const key = variant.productId.toString();
    const current = variantMap.get(key) ?? [];
    current.push(variant);
    variantMap.set(key, current);
  }

  const items = products.map((product) => {
    const productVariants = variantMap.get(product._id.toString()) ?? [];
    const totalStock = productVariants.reduce((sum, variant) => sum + variant.stockQuantity, 0);
    const category = categoryMap.get(product.categoryId.toString());

    let stockStatus = "Out of Stock";
    if (totalStock > LOW_STOCK_THRESHOLD) {
      stockStatus = "Active";
    } else if (totalStock > 0) {
      stockStatus = "Low Stock";
    }

    return {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: category?.name ?? "Uncategorized",
      categorySlug: category?.slug ?? "",
      isActive: product.isActive,
      stockQuantity: totalStock,
      stockStatus,
      variants: productVariants.map((variant) => ({
        _id: variant._id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stockQuantity: variant.stockQuantity,
        priceAdjustment: variant.priceAdjustment
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  });

  return {
    items,
    meta: toPaginationMeta(page, limit, total)
  };
};

export const getAdminProductDetail = async (productId: string) => {
  ensureObjectId(productId, "product id");

  const product = await ProductModel.findById(productId).lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const [category, variants, images] = await Promise.all([
    CategoryModel.findById(product.categoryId).select("_id name slug").lean(),
    ProductVariantModel.find({ productId: product._id }).sort({ createdAt: 1 }).lean(),
    ProductImageModel.find({ productId: product._id }).sort({ sortOrder: 1, createdAt: 1 }).lean()
  ]);

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    isActive: product.isActive,
    category: category
      ? {
          _id: category._id,
          name: category.name,
          slug: category.slug
        }
      : null,
    variants: variants.map((variant) => ({
      _id: variant._id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      priceAdjustment: variant.priceAdjustment
    })),
    images: images.map((image) => ({
      _id: image._id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

export const createAdminProduct = async (actorUserId: string, input: CreateAdminProductInput) => {
  const categoryId = await resolveCategoryId(input);
  if (!categoryId) {
    throw new ApiError(400, "categoryId, categorySlug, or categoryName is required");
  }

  const slug = await ensureUniqueProductSlug(input.name);

  const product = await ProductModel.create({
    categoryId,
    name: input.name,
    slug,
    description: input.description ?? "",
    price: input.price,
    imageUrl: input.imageUrl ?? "",
    isActive: input.isActive ?? true
  });

  const variantSku = input.variant?.sku?.trim();
  if (variantSku) {
    await ProductVariantModel.create({
      productId: product._id,
      sku: variantSku,
      size: input.variant?.size ?? "",
      color: input.variant?.color ?? "",
      stockQuantity: Math.max(0, Number(input.variant?.stockQuantity ?? 0)),
      priceAdjustment: Number(input.variant?.priceAdjustment ?? 0)
    });
  }

  if (input.imageUrls?.length) {
    const docs = input.imageUrls
      .filter((url) => Boolean(url?.trim()))
      .map((url, index) => ({
        productId: product._id,
        url,
        alt: input.name,
        sortOrder: index
      }));

    if (docs.length > 0) {
      await ProductImageModel.insertMany(docs);
      if (!product.imageUrl) {
        product.imageUrl = docs[0].url;
        await product.save();
      }
    }
  }

  await writeAudit(actorUserId, "admin.product.create", "product", product._id.toString(), {
    name: product.name,
    slug: product.slug
  });

  return getAdminProductDetail(product._id.toString());
};

export const updateAdminProduct = async (
  actorUserId: string,
  productId: string,
  input: UpdateAdminProductInput
) => {
  ensureObjectId(productId, "product id");

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (input.name?.trim()) {
    product.name = input.name.trim();
    product.slug = await ensureUniqueProductSlug(product.name, product._id.toString());
  }

  if (typeof input.description === "string") {
    product.description = input.description;
  }

  if (typeof input.price === "number") {
    product.price = input.price;
  }

  if (typeof input.imageUrl === "string") {
    product.imageUrl = input.imageUrl;
  }

  if (typeof input.isActive === "boolean") {
    product.isActive = input.isActive;
  }

  const categoryId = await resolveCategoryId(input);
  if (categoryId) {
    product.categoryId = categoryId;
  }

  await product.save();

  if (input.variant?.sku?.trim()) {
    const existingVariant = await ProductVariantModel.findOne({ productId: product._id }).sort({ createdAt: 1 });
    if (existingVariant) {
      existingVariant.sku = input.variant.sku.trim();
      if (typeof input.variant.size === "string") {
        existingVariant.size = input.variant.size;
      }
      if (typeof input.variant.color === "string") {
        existingVariant.color = input.variant.color;
      }
      if (typeof input.variant.stockQuantity === "number") {
        existingVariant.stockQuantity = Math.max(0, input.variant.stockQuantity);
      }
      if (typeof input.variant.priceAdjustment === "number") {
        existingVariant.priceAdjustment = input.variant.priceAdjustment;
      }
      await existingVariant.save();
    } else {
      await ProductVariantModel.create({
        productId: product._id,
        sku: input.variant.sku.trim(),
        size: input.variant.size ?? "",
        color: input.variant.color ?? "",
        stockQuantity: Math.max(0, Number(input.variant.stockQuantity ?? 0)),
        priceAdjustment: Number(input.variant.priceAdjustment ?? 0)
      });
    }
  }

  if (input.imageUrls?.length) {
    const existingMax = await ProductImageModel.find({ productId: product._id })
      .sort({ sortOrder: -1 })
      .limit(1)
      .lean();

    let sortOrder = (existingMax[0]?.sortOrder ?? -1) + 1;

    const docs = input.imageUrls
      .filter((url) => Boolean(url?.trim()))
      .map((url) => {
        const doc = {
          productId: product._id,
          url,
          alt: product.name,
          sortOrder
        };
        sortOrder += 1;
        return doc;
      });

    if (docs.length > 0) {
      await ProductImageModel.insertMany(docs);
      if (!product.imageUrl) {
        product.imageUrl = docs[0].url;
        await product.save();
      }
    }
  }

  await writeAudit(actorUserId, "admin.product.update", "product", product._id.toString(), {
    name: product.name,
    slug: product.slug
  });

  return getAdminProductDetail(product._id.toString());
};

export const archiveAdminProduct = async (actorUserId: string, productId: string) => {
  ensureObjectId(productId, "product id");

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Perform hard delete
  const result = await ProductModel.findByIdAndDelete(productId);
  
  if (!result) {
    throw new ApiError(500, "Failed to delete product");
  }

  // Remove related data
  await Promise.all([
    ProductVariantModel.deleteMany({ productId: product._id }),
    ProductImageModel.deleteMany({ productId: product._id })
  ]);

  await writeAudit(actorUserId, "admin.product.delete", "product", product._id.toString(), {
    name: product.name
  });

  return {
    _id: product._id,
    name: product.name,
    message: "Product deleted successfully"
  };
};

export const archiveAdminProductSoft = async (actorUserId: string, productId: string) => {
  ensureObjectId(productId, "product id");

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  await writeAudit(actorUserId, "admin.product.archive", "product", product._id.toString(), {
    name: product.name
  });

  return {
    _id: product._id,
    name: product.name,
    isActive: product.isActive
  };
};

export const createAdminProductImage = async (
  actorUserId: string,
  productId: string,
  image: { pathUrl: string; alt?: string }
) => {
  ensureObjectId(productId, "product id");

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const maxSort = await ProductImageModel.find({ productId: product._id })
    .sort({ sortOrder: -1 })
    .limit(1)
    .lean();

  const sortOrder = (maxSort[0]?.sortOrder ?? -1) + 1;

  const productImage = await ProductImageModel.create({
    productId: product._id,
    url: image.pathUrl,
    alt: image.alt ?? product.name,
    sortOrder
  });

  if (!product.imageUrl) {
    product.imageUrl = image.pathUrl;
    await product.save();
  }

  await writeAudit(actorUserId, "admin.product.image.upload", "product", product._id.toString(), {
    imageUrl: image.pathUrl
  });

  return {
    _id: productImage._id,
    url: productImage.url,
    alt: productImage.alt,
    sortOrder: productImage.sortOrder
  };
};

const ORDER_STATUS_FLOW: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: []
};

export const listAdminOrders = async (query: AdminOrderListQuery) => {
  const { page, limit, skip } = toPagination(query);
  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search?.trim()) {
    const keyword = query.search.trim();
    const userRegex = new RegExp(keyword, "i");

    const matchedUsers = await UserModel.find({
      $or: [{ email: userRegex }, { firstName: userRegex }, { lastName: userRegex }]
    })
      .select("_id")
      .lean();

    const userIds = matchedUsers.map((item) => item._id);
    const orFilters: Record<string, unknown>[] = [];

    if (Types.ObjectId.isValid(keyword)) {
      orFilters.push({ _id: new Types.ObjectId(keyword) });
    }

    if (userIds.length > 0) {
      orFilters.push({ userId: { $in: userIds } });
    }

    if (orFilters.length === 0) {
      return {
        items: [],
        meta: toPaginationMeta(page, limit, 0)
      };
    }

    filter.$or = orFilters;
  }

  const [total, orders] = await Promise.all([
    OrderModel.countDocuments(filter),
    OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
  ]);

  const userIds = [...new Set(orders.map((item) => item.userId.toString()))];
  const orderIds = orders.map((item) => item._id);

  const [users, payments] = await Promise.all([
    UserModel.find({ _id: { $in: userIds } }).select("_id email firstName lastName").lean(),
    PaymentModel.find({ orderId: { $in: orderIds } }).sort({ createdAt: -1 }).lean()
  ]);

  const userMap = new Map(users.map((user) => [user._id.toString(), user]));
  const paymentMap = new Map<string, (typeof payments)[number]>();

  for (const payment of payments) {
    const key = payment.orderId.toString();
    if (!paymentMap.has(key)) {
      paymentMap.set(key, payment);
    }
  }

  const items = orders
    .map((order) => {
      const user = userMap.get(order.userId.toString());
      const payment = paymentMap.get(order._id.toString());

      const customerName = user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
        : "Unknown Customer";

      return {
        _id: order._id,
        orderCode: order._id.toString(),
        customer: customerName,
        customerEmail: user?.email ?? "",
        date: order.createdAt,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: payment?.status ?? "pending",
        productImageUrl: (order.items && order.items.length > 0 && order.items[0].imageUrl) || "",
        productName: (order.items && order.items.length > 0 && order.items[0].name) || "Sản phẩm"
      };
    })
    .filter((item) => (query.paymentStatus ? item.paymentStatus === query.paymentStatus : true));

  return {
    items,
    meta: toPaginationMeta(page, limit, query.paymentStatus ? items.length : total)
  };
};

export const getAdminOrderDetail = async (orderId: string) => {
  ensureObjectId(orderId, "order id");

  const order = await OrderModel.findById(orderId).lean();
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const [user, payment] = await Promise.all([
    UserModel.findById(order.userId).select("_id email firstName lastName phone").lean(),
    PaymentModel.findOne({ orderId: order._id }).sort({ createdAt: -1 }).lean()
  ]);

  return {
    _id: order._id,
    orderCode: order._id.toString(),
    status: order.status,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
    customer: user
      ? {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      : null,
    payment: payment
      ? {
          _id: payment._id,
          status: payment.status,
          provider: payment.provider,
          amount: payment.amount,
          currency: payment.currency,
          transactionRef: payment.transactionRef
        }
      : null,
    items: order.items
  };
};

export const updateAdminOrderStatus = async (
  actorUserId: string,
  orderId: string,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
) => {
  ensureObjectId(orderId, "order id");

  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== status) {
    const allowed = ORDER_STATUS_FLOW[order.status] ?? [];
    if (!allowed.includes(status)) {
      throw new ApiError(422, `Cannot update status from ${order.status} to ${status}`);
    }

    order.status = status;
    await order.save();
  }

  await writeAudit(actorUserId, "admin.order.status.update", "order", order._id.toString(), {
    status
  });

  return order;
};

export const updateAdminPaymentStatus = async (
  actorUserId: string,
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed"
) => {
  ensureObjectId(orderId, "order id");

  const order = await OrderModel.findById(orderId).select("_id userId totalAmount").lean();
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const payment = await PaymentModel.findOne({ orderId: order._id }).sort({ createdAt: -1 });

  if (payment) {
    payment.status = paymentStatus;
    await payment.save();
  } else {
    await PaymentModel.create({
      orderId: order._id,
      userId: order.userId,
      amount: order.totalAmount,
      status: paymentStatus,
      provider: "manual"
    });
  }

  await writeAudit(actorUserId, "admin.payment.status.update", "order", order._id.toString(), {
    paymentStatus
  });

  return {
    orderId: order._id,
    paymentStatus
  };
};

export const listAdminCustomers = async (query: AdminListQuery) => {
  const { page, limit, skip } = toPagination(query);

  const filter: Record<string, unknown> = { role: USER_ROLES.CUSTOMER };

  if (query.search?.trim()) {
    const regex = new RegExp(query.search.trim(), "i");
    filter.$or = [
      { email: regex },
      { firstName: regex },
      { lastName: regex },
      { phone: regex }
    ];
  }

  const [total, customers] = await Promise.all([
    UserModel.countDocuments(filter),
    UserModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id email firstName lastName phone createdAt")
      .lean()
  ]);

  const customerIds = customers.map((item) => item._id);

  const orderMetrics = await OrderModel.aggregate<{
    _id: Types.ObjectId;
    orderCount: number;
    totalSpent: number;
  }>([
    { $match: { userId: { $in: customerIds } } },
    {
      $group: {
        _id: "$userId",
        orderCount: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" }
      }
    }
  ]);

  const metricsMap = new Map(orderMetrics.map((item) => [item._id.toString(), item]));

  const items = customers.map((customer) => {
    const metric = metricsMap.get(customer._id.toString());
    return {
      _id: customer._id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName:
        `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      orderCount: metric?.orderCount ?? 0,
      totalSpent: metric?.totalSpent ?? 0
    };
  });

  return {
    items,
    meta: toPaginationMeta(page, limit, total)
  };
};

export const getAdminCustomerDetail = async (customerId: string) => {
  ensureObjectId(customerId, "customer id");

  const customer = await UserModel.findOne({
    _id: customerId,
    role: USER_ROLES.CUSTOMER
  })
    .select("_id email firstName lastName phone createdAt")
    .lean();

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  const [ordersCount, aggregateSpent] = await Promise.all([
    OrderModel.countDocuments({ userId: customer._id }),
    OrderModel.aggregate<{ totalSpent: number }>([
      { $match: { userId: customer._id } },
      { $group: { _id: null, totalSpent: { $sum: "$totalAmount" } } }
    ])
  ]);

  return {
    _id: customer._id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    fullName: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,
    orderCount: ordersCount,
    totalSpent: aggregateSpent[0]?.totalSpent ?? 0
  };
};

export const listAdminCustomerOrders = async (customerId: string) => {
  ensureObjectId(customerId, "customer id");

  const orders = await OrderModel.find({ userId: customerId }).sort({ createdAt: -1 }).lean();
  const paymentDocs = await PaymentModel.find({ orderId: { $in: orders.map((order) => order._id) } }).lean();

  const paymentMap = new Map(paymentDocs.map((payment) => [payment.orderId.toString(), payment]));

  return orders.map((order) => ({
    _id: order._id,
    orderCode: order._id.toString(),
    createdAt: order.createdAt,
    status: order.status,
    totalAmount: order.totalAmount,
    paymentStatus: paymentMap.get(order._id.toString())?.status ?? "pending"
  }));
};

export const getAdminDashboardStats = async () => {
  const [totalProducts, totalCustomers, totalOrders, paidPayments, lowStockCount, recentOrders] =
    await Promise.all([
      ProductModel.countDocuments({ isActive: true }),
      UserModel.countDocuments({ role: USER_ROLES.CUSTOMER }),
      OrderModel.countDocuments(),
      PaymentModel.aggregate<{ totalRevenue: number }>([
        { $match: { status: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
      ]),
      ProductVariantModel.countDocuments({ stockQuantity: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } }),
      OrderModel.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

  const recentUsers = await UserModel.find({
    _id: { $in: [...new Set(recentOrders.map((order) => order.userId.toString()))] }
  })
    .select("_id email firstName lastName")
    .lean();

  const userMap = new Map(recentUsers.map((user) => [user._id.toString(), user]));

  return {
    summary: {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue: paidPayments[0]?.totalRevenue ?? 0,
      lowStockVariants: lowStockCount
    },
    recentOrders: recentOrders.map((order) => {
      const user = userMap.get(order.userId.toString());
      return {
        _id: order._id,
        orderCode: order._id.toString(),
        customer:
          user && (`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email),
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      };
    })
  };
};
