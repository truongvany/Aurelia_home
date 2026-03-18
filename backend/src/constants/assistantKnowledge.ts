export type KnowledgeSourceKind = "faq" | "policy" | "support" | "checkout";

export interface KnowledgeSource {
  id: string;
  kind: KnowledgeSourceKind;
  title: string;
  url: string;
  keywords: string[];
  snippet: string;
  content: string;
}

export const ASSISTANT_KNOWLEDGE_BASE: KnowledgeSource[] = [
  {
    id: "checkout-flow",
    kind: "checkout",
    title: "How to place an order",
    url: "/checkout",
    keywords: ["order", "checkout", "buy", "purchase", "place", "dat hang"],
    snippet: "Customers add items to cart, go to checkout, enter shipping and billing information, and submit the order.",
    content:
      "Order flow: browse /shop or /product/:id, add product variant to cart, review cart, open /checkout, enter shipping address and billing address, then place order."
  },
  {
    id: "payment-overview",
    kind: "policy",
    title: "Payment information",
    url: "/checkout",
    keywords: ["payment", "pay", "cod", "card", "bank", "thanh toan"],
    snippet: "Current platform records payment status and supports paid, pending, and failed states.",
    content:
      "Payments are tracked per order with status pending, paid, or failed. The assistant should recommend confirming method and order status from checkout and order detail pages."
  },
  {
    id: "order-tracking",
    kind: "faq",
    title: "Track and manage order",
    url: "/profile",
    keywords: ["track", "shipping", "status", "order status", "don hang", "giao hang"],
    snippet: "Users can view order history and status changes such as pending, paid, shipped, delivered, or cancelled.",
    content:
      "Order statuses include pending, paid, shipped, delivered, and cancelled. Customers can review orders from profile and order detail pages."
  },
  {
    id: "customer-support",
    kind: "support",
    title: "Customer support",
    url: "/contact",
    keywords: ["support", "help", "contact", "hotro", "tro giup", "refund", "return"],
    snippet: "For account, order, or post-purchase support, users can submit an inquiry from contact page.",
    content:
      "Direct customers to /contact for support requests about payment issues, order updates, return questions, or account help."
  },
  {
    id: "product-discovery",
    kind: "faq",
    title: "Find products quickly",
    url: "/shop",
    keywords: ["find", "search", "product", "style", "recommend", "goi y", "tim san pham"],
    snippet: "Use category and text search to discover matching products, then open product detail links.",
    content:
      "Customers can search products by keywords, then open /product/:id to review details, variants, and availability before adding to cart."
  }
];
