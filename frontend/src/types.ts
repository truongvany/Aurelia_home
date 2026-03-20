export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin';
  isMember?: boolean;
  memberStatus?: 'inactive' | 'pending' | 'active';
  memberSince?: string | null;
}

export interface MembershipPayload {
  user: User;
  benefits: {
    freeShipping: boolean;
    flexibleSizeExchange: boolean;
    priorityContact: boolean;
    freeAlteration: boolean;
    fashionWarranty: boolean;
    bespokeDesignSupport: boolean;
  };
}

export interface VoucherPayload {
  _id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  source: 'generic' | 'welcome' | 'membership';
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
  usedCount: number;
  maxUsesPerUser: number;
}

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface ChatMessage {
  _id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  sources?: ChatSource[];
  suggestedProducts?: ChatSuggestedProduct[];
}

export interface ChatSource {
  id: string;
  title: string;
  kind: 'faq' | 'policy' | 'support' | 'checkout' | string;
  url: string;
  snippet: string;
}

export interface ChatSuggestedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  url: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ProfilePayload {
  user: User;
  profile: {
    _id: string;
    userId: string;
    bodyType?: string;
    stylePreference?: string;
    heightCm?: number;
    weightKg?: number;
    skinTone?: string;
  } | null;
}

export interface CartItemApi {
  _id: string;
  productId: string;
  productVariantId: string;
  quantity: number;
  size: string;
  color: string;
  unitPrice: number;
  productName: string;
  productImageUrl: string;
  lineTotal: number;
}

export interface CartPayload {
  _id?: string;
  userId: string;
  items: CartItemApi[];
  total: number;
  appliedCouponCode?: string;
  discountAmount?: number;
  finalAmount?: number;
  shippingFee?: number;
  freeShippingApplied?: boolean;
}

export interface OrderPayload {
  _id: string;
  status: string;
  totalAmount: number;
  discountAmount?: number;
  finalAmount?: number;
  appliedCouponCode?: string;
  shippingFee?: number;
  freeShippingApplied?: boolean;
  flexibleSizeExchangeEligible?: boolean;
  prioritySupportEligible?: boolean;
  shippingAddress: string;
  billingAddress: string;
  items: Array<{
    _id?: string;
    productId: string;
    productVariantId: string;
    name: string;
    imageUrl?: string;
    quantity: number;
    unitPrice: number;
    size: string;
    color: string;
  }>;
  createdAt: string;
}
