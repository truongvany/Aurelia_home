import type {
  AuthPayload,
  CartPayload,
  OrderPayload,
  Product,
  ProfilePayload
} from "../types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5000/api/v1";

const ACCESS_TOKEN_KEY = "aurelia_access_token";
const REFRESH_TOKEN_KEY = "aurelia_refresh_token";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

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

  if (!headers.has("Content-Type") && options?.body) {
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

export const api = {
  getCategories: () => request<Array<{ _id: string; name: string; slug: string }>>("/catalog/categories"),
  getProducts: (params?: URLSearchParams) =>
    request<Product[]>(`/catalog/products${params ? `?${params.toString()}` : ""}`),
  getFeaturedProducts: () => request<Product[]>("/catalog/products/featured"),
  getProductById: (id: string) => request<Product & { variants: Array<{ _id: string; size: string; color: string; sku: string; stockQuantity: number }> }>(`/catalog/products/${id}`),

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
  me: () => request<{ _id: string; email: string; firstName: string; lastName: string; role: "customer" | "admin" }>("/auth/me"),

  getProfile: () => request<ProfilePayload>("/profile"),
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
    }),
  updateCartItem: (itemId: string, quantity: number) =>
    request<CartPayload>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }),
  removeCartItem: (itemId: string) =>
    request<CartPayload>(`/cart/items/${itemId}`, {
      method: "DELETE"
    }),
  clearCart: () =>
    request<CartPayload>("/cart/clear", {
      method: "POST"
    }),

  placeOrder: (input: { shippingAddress: string; billingAddress?: string }) =>
    request<OrderPayload>("/orders", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  getMyOrders: () => request<OrderPayload[]>("/orders"),

  submitContact: (input: { name: string; email: string; subject: string; message: string }) =>
    request<{ _id: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  sendChatMessage: (input: { message: string; conversationId?: string }) =>
    request<{ conversationId: string; userMessage: { _id: string; sender: "user" | "ai"; text: string; createdAt: string }; aiMessage: { _id: string; sender: "user" | "ai"; text: string; createdAt: string } }>(
      "/chat/messages",
      {
        method: "POST",
        body: JSON.stringify(input)
      }
    )
};
