import type {
  AuthPayload,
  CartPayload,
  ChatSource,
  ChatSuggestedProduct,
  MembershipPayload,
  OrderPayload,
  Product,
  ProfilePayload,
  VoucherPayload
} from "../types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MegaMenuCategory {
  title: string;
  items: Array<{ name: string; slug: string; isHighlight?: boolean; description?: string; productCount?: number }>;
}

interface AdminMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminProductItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  categorySlug: string;
  isActive: boolean;
  stockQuantity: number;
  stockStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminProductDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  sizeGuideImageUrl: string;
  isActive: boolean;
  category: { _id: string; name: string; slug: string } | null;
  variants: Array<{
    _id: string;
    sku: string;
    size: string;
    color: string;
    imageUrl?: string;
    stockQuantity: number;
    priceAdjustment: number;
  }>;
  images: Array<{ _id: string; url: string; alt: string; sortOrder: number }>;
}

interface AdminOrderItem {
  _id: string;
  orderCode: string;
  customer: string;
  customerEmail: string;
  date: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

interface AdminOrderDetail {
  _id: string;
  orderCode: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  trackingNumber: string;
  createdAt: string;
  customer: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
  payment: {
    _id: string;
    status: string;
    provider: string;
    amount: number;
    currency: string;
    transactionRef: string;
  } | null;
  items: Array<{
    productId: string;
    productVariantId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    size: string;
    color: string;
  }>;
}

interface AdminCustomerItem {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

interface AdminCustomerDetail {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

interface AdminMembershipRequestItem {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone?: string;
  isMember: boolean;
  memberStatus: "inactive" | "pending" | "active";
  memberSince?: string | null;
  membershipRequestedAt?: string | null;
  membershipReviewedAt?: string | null;
  membershipReviewNote?: string;
  createdAt: string;
}

interface AdminVoucherItem {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  source: "generic" | "welcome" | "membership";
  assignedUserId?: string | null;
  maxUsesPerUser: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

interface AdminDashboardPayload {
  summary: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockVariants: number;
    pendingMembershipRequests: number;
    activeMembers: number;
    activeVouchers: number;
    usedMembershipVouchers: number;
  };
  recentOrders: Array<{
    _id: string;
    orderCode: string;
    customer?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5000/api/v1";

const ACCESS_TOKEN_KEY = "aurelia_access_token";
const REFRESH_TOKEN_KEY = "aurelia_refresh_token";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const emitCartUpdated = () => {
  window.dispatchEvent(new Event("aurelia:cart-updated"));
};

export const hasAuthSession = () => Boolean(getAccessToken() && getRefreshToken());

export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setAuthSession = (payload: AuthPayload) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
};

const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    clearAuthSession();
    return false;
  }

  const payload = (await response.json()) as ApiEnvelope<AuthPayload>;
  setAuthSession(payload.data);
  return true;
};

const request = async <T>(
  path: string,
  options?: RequestInit,
  retryOnUnauthorized = true
): Promise<T> => {
  const headers = new Headers(options?.headers ?? {});

  if (!headers.has("Content-Type") && options?.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 && retryOnUnauthorized) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return request<T>(path, options, false);
    }
  }

  const payload = (await response.json()) as ApiEnvelope<T> | { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return (payload as ApiEnvelope<T>).data;
};

const withQuery = (path: string, query?: Record<string, string | number | boolean | undefined>) => {
  if (!query) {
    return path;
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

export const api = {
  getMegaMenu: () => request<MegaMenuCategory[]>("/catalog/megamenu"),
  getCategories: () => request<Array<{ _id: string; name: string; slug: string }>>("/catalog/categories"),
  getProducts: (params?: URLSearchParams) =>
    request<Product[]>(`/catalog/products${params ? `?${params.toString()}` : ""}`),
  getFeaturedProducts: () => request<Product[]>("/catalog/products/featured"),
  getProductById: (id: string) =>
    request<
      Product & {
        categorySlug: string;
        sizeGuideImageUrl: string;
        variants: Array<{ _id: string; size: string; color: string; sku: string; stockQuantity: number }>;
        images: Array<{ _id: string; url: string; alt: string; sortOrder: number }>;
      }
    >(`/catalog/products/${id}`),

  register: (input: { email: string; password: string; firstName: string; lastName: string }) =>
    request<AuthPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  login: (input: { email: string; password: string }) =>
    request<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  me: () =>
    request<{
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "customer" | "admin";
      isMember?: boolean;
      memberStatus?: "inactive" | "pending" | "active";
      memberSince?: string | null;
    }>("/auth/me"),

  getProfile: () => request<ProfilePayload>("/profile"),
  getMembership: () => request<MembershipPayload>("/profile/membership"),
  enrollMembership: () => request<MembershipPayload>("/profile/membership/enroll", { method: "POST" }),
  getVouchers: () => request<VoucherPayload[]>("/profile/vouchers"),
  updateProfile: (input: { firstName?: string; lastName?: string; phone?: string }) =>
    request<ProfilePayload["user"]>("/profile", {
      method: "PATCH",
      body: JSON.stringify(input)
    }),

  getCart: () => request<CartPayload>("/cart"),
  addToCart: (input: { productId: string; productVariantId: string; quantity: number }) =>
    request<CartPayload>("/cart/items", {
      method: "POST",
      body: JSON.stringify(input)
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),
  updateCartItem: (itemId: string, quantity: number) =>
    request<CartPayload>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),
  removeCartItem: (itemId: string) =>
    request<CartPayload>(`/cart/items/${itemId}`, {
      method: "DELETE"
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),
  clearCart: () =>
    request<CartPayload>("/cart/clear", {
      method: "POST"
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),
  applyCartCoupon: (code: string) =>
    request<CartPayload>("/cart/apply-coupon", {
      method: "POST",
      body: JSON.stringify({ code })
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),
  removeCartCoupon: () =>
    request<CartPayload>("/cart/remove-coupon", {
      method: "POST"
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),

  placeOrder: (input: { shippingAddress: string; billingAddress?: string; couponCode?: string }) =>
    request<OrderPayload>("/orders", {
      method: "POST",
      body: JSON.stringify(input)
    }).then((payload) => {
      emitCartUpdated();
      return payload;
    }),
  getMyOrders: () => request<OrderPayload[]>("/orders"),
  getMyOrderById: (orderId: string) => request<OrderPayload>(`/orders/${orderId}`),

  submitContact: (input: { name: string; email: string; subject: string; message: string }) =>
    request<{ _id: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  sendChatMessage: (input: { message: string; conversationId?: string }) =>
    request<{
      conversationId: string;
      userMessage: { _id: string; sender: "user" | "ai"; text: string; createdAt: string };
      aiMessage: { _id: string; sender: "user" | "ai"; text: string; createdAt: string };
      sources: ChatSource[];
      suggestedProducts: ChatSuggestedProduct[];
    }>(
      "/chat/messages",
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    ),

  getAdminDashboard: () => request<AdminDashboardPayload>("/admin/dashboard"),
  getAdminProducts: (query?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: "active" | "inactive";
  }) => request<{ items: AdminProductItem[]; meta: AdminMeta }>(withQuery("/admin/products", query)),
  getAdminProductById: (productId: string) => request<AdminProductDetail>(`/admin/products/${productId}`),
  createAdminProduct: (input: {
    name: string;
    description?: string;
    price: number;
    categoryId?: string;
    categorySlug?: string;
    categoryName?: string;
    imageUrl?: string;
    sizeGuideImageUrl?: string;
    imageUrls?: string[];
    isActive?: boolean;
    variant?: {
      sku?: string;
      size?: string;
      color?: string;
      imageUrl?: string;
      stockQuantity?: number;
      priceAdjustment?: number;
    };
    variants?: Array<{
      sku?: string;
      size?: string;
      color?: string;
      imageUrl?: string;
      stockQuantity?: number;
      priceAdjustment?: number;
    }>;
  }) =>
    request<AdminProductDetail>("/admin/products", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  updateAdminProduct: (
    productId: string,
    input: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: string;
      categorySlug?: string;
      categoryName?: string;
      imageUrl?: string;
      sizeGuideImageUrl?: string;
      imageUrls?: string[];
      isActive?: boolean;
      variant?: {
        sku?: string;
        size?: string;
        color?: string;
        imageUrl?: string;
        stockQuantity?: number;
        priceAdjustment?: number;
      };
      variants?: Array<{
        sku?: string;
        size?: string;
        color?: string;
        imageUrl?: string;
        stockQuantity?: number;
        priceAdjustment?: number;
      }>;
    }
  ) =>
    request<AdminProductDetail>(`/admin/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  archiveAdminProduct: (productId: string) =>
    request<{ _id: string; name: string; isActive: boolean }>(`/admin/products/${productId}`, {
      method: "DELETE"
    }),
  uploadAdminProductImage: (productId: string, file: File, alt?: string) => {
    const formData = new FormData();
    formData.append("image", file);
    if (alt) {
      formData.append("alt", alt);
    }

    return request<{ _id: string; url: string; alt: string; sortOrder: number }>(
      `/admin/products/${productId}/images`,
      {
        method: "POST",
        body: formData
      }
    );
  },
  uploadAdminProductSizeGuideImage: (productId: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return request<{ _id: string; sizeGuideImageUrl: string }>(
      `/admin/products/${productId}/size-guide-image`,
      {
        method: "POST",
        body: formData
      }
    );
  },

  getAdminOrders: (query?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "pending" | "paid" | "failed";
  }) => request<{ items: AdminOrderItem[]; meta: AdminMeta }>(withQuery("/admin/orders", query)),
  getAdminOrderById: (orderId: string) => request<AdminOrderDetail>(`/admin/orders/${orderId}`),
  updateAdminOrderStatus: (
    orderId: string,
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  ) =>
    request<OrderPayload>(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
  updateAdminPaymentStatus: (orderId: string, paymentStatus: "pending" | "paid" | "failed") =>
    request<{ orderId: string; paymentStatus: string }>(`/admin/orders/${orderId}/payment-status`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus })
    }),

  getAdminCustomers: (query?: { page?: number; limit?: number; search?: string }) =>
    request<{ items: AdminCustomerItem[]; meta: AdminMeta }>(withQuery("/admin/customers", query)),
  getAdminCustomerById: (customerId: string) => request<AdminCustomerDetail>(`/admin/customers/${customerId}`),
  getAdminCustomerOrders: (customerId: string) =>
    request<
      Array<{
        _id: string;
        orderCode: string;
        createdAt: string;
        status: string;
        totalAmount: number;
        paymentStatus: string;
      }>
    >(`/admin/customers/${customerId}/orders`),
  getAdminMembershipRequests: (query?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "inactive" | "pending" | "active";
  }) =>
    request<{ items: AdminMembershipRequestItem[]; meta: AdminMeta }>(
      withQuery("/admin/membership-requests", query)
    ),
  reviewAdminMembershipRequest: (
    userId: string,
    action: "approve" | "reject",
    note?: string
  ) =>
    request<AdminMembershipRequestItem>(`/admin/membership-requests/${userId}/${action}`, {
      method: "PATCH",
      body: JSON.stringify({ note })
    }),
  getAdminVouchers: (query?: {
    page?: number;
    limit?: number;
    search?: string;
    source?: "generic" | "welcome" | "membership";
    isActive?: boolean;
  }) => request<{ items: AdminVoucherItem[]; meta: AdminMeta }>(withQuery("/admin/vouchers", query)),
  createAdminVoucher: (input: {
    code: string;
    discountType: "percent" | "fixed";
    discountValue: number;
    minOrderAmount?: number;
    expiresAt: string;
    source?: "generic" | "welcome" | "membership";
    assignedUserId?: string;
    maxUsesPerUser?: number;
  }) =>
    request<AdminVoucherItem>("/admin/vouchers", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  deactivateAdminVoucher: (voucherId: string) =>
    request<AdminVoucherItem>(`/admin/vouchers/${voucherId}/deactivate`, {
      method: "PATCH"
    })
};
