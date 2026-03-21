import { Types } from "mongoose";
import Groq from "groq-sdk";
import { env } from "../config/env.js";
import { ASSISTANT_KNOWLEDGE_BASE } from "../constants/assistantKnowledge.js";
import { AiConversationModel } from "../models/aiConversation.model.js";
import { AiMessageModel } from "../models/aiMessage.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { ApiError } from "../utils/ApiError.js";

interface SendMessageInput {
  userId?: string;
  message: string;
  conversationId?: string;
}

interface ChatSource {
  id: string;
  title: string;
  kind: string;
  url: string;
  snippet: string;
}

interface SuggestedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  url: string;
}

type ScoredKnowledgeSource = (typeof ASSISTANT_KNOWLEDGE_BASE)[number] & {
  relevance: number;
};

interface ProductSearchDoc {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface RetrievalOutput {
  sources: ScoredKnowledgeSource[];
  suggestedProducts: SuggestedProduct[];
}

const getGroqClient = () => {
  if (!env.GROQ_API_KEY) {
    return null;
  }
  return new Groq({
    apiKey: env.GROQ_API_KEY
  });
};

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const scoreKnowledge = (queryTokens: string[], keywords: string[]): number => {
  const keywordTokens = keywords.flatMap((keyword) => tokenize(keyword));
  const keywordSet = new Set(keywordTokens);
  const overlap = queryTokens.filter((token) => keywordSet.has(token)).length;
  return overlap;
};

const retrieveKnowledge = (query: string): ScoredKnowledgeSource[] => {
  const queryTokens = tokenize(query);

  const scored = ASSISTANT_KNOWLEDGE_BASE.map((source) => ({
    ...source,
    relevance: scoreKnowledge(queryTokens, source.keywords)
  }))
    .filter((source) => source.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 4);

  if (scored.length > 0) {
    return scored;
  }

  return ASSISTANT_KNOWLEDGE_BASE.slice(0, 3).map((source) => ({
    ...source,
    relevance: 1
  }));
};

const retrieveProducts = async (query: string): Promise<SuggestedProduct[]> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const keywordTokens = tokenize(trimmed).slice(0, 8);
  const regex = keywordTokens.length
    ? new RegExp(keywordTokens.map((token) => escapeRegex(token)).join("|"), "i")
    : null;

  let products: ProductSearchDoc[] = [];

  if (trimmed.length >= 3) {
    try {
      products = await ProductModel.find({ isActive: true, $text: { $search: trimmed } })
        .sort({ createdAt: -1 })
        .limit(6)
        .select({ _id: 1, name: 1, description: 1, price: 1, imageUrl: 1 })
        .lean<ProductSearchDoc[]>();
    } catch {
      products = [];
    }
  }

  if (products.length === 0 && regex) {
    products = await ProductModel.find({
      isActive: true,
      $or: [{ name: regex }, { description: regex }]
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .select({ _id: 1, name: 1, description: 1, price: 1, imageUrl: 1 })
      .lean<ProductSearchDoc[]>();
  }

  if (products.length === 0) {
    products = await ProductModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select({ _id: 1, name: 1, description: 1, price: 1, imageUrl: 1 })
      .lean<ProductSearchDoc[]>();
  }

  const variants = await ProductVariantModel.find({
    productId: { $in: products.map((product) => product._id) }
  }).lean();

  const stockByProductId = new Map<string, boolean>();
  for (const variant of variants) {
    const key = variant.productId.toString();
    const hasStock = (stockByProductId.get(key) ?? false) || variant.stockQuantity > 0;
    stockByProductId.set(key, hasStock);
  }

  return products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    inStock: stockByProductId.get(product._id.toString()) ?? false,
    url: `/product/${product._id.toString()}`
  }));
};

const runRetrieval = async (query: string): Promise<RetrievalOutput> => {
  const sources = retrieveKnowledge(query);
  const suggestedProducts = await retrieveProducts(query);
  return { sources, suggestedProducts };
};

const buildSystemPrompt = (
  sources: ScoredKnowledgeSource[],
  suggestedProducts: SuggestedProduct[]
) => {
  const sourceContext = sources
    .map(
      (source, index) =>
        `${index + 1}. [${source.kind}] ${source.title} | URL: ${source.url}\n${source.content}`
    )
    .join("\n\n");

  const productContext = suggestedProducts.length
    ? suggestedProducts
        .map(
          (product, index) =>
            `${index + 1}. ${product.name} | Price: ${product.price} | In stock: ${product.inStock ? "yes" : "no"} | URL: ${product.url} | ImageUrl: ${product.imageUrl} | Notes: ${product.description}`
        )
        .join("\n")
    : "No specific product matched strongly. You may suggest browsing /shop.";

  return `You are King Man, the virtual assistant for King Man. Respond in Vietnamese.

Rules:
- VERY SHORT replies (2-3 sentences max). Be direct and polite.
- Use professional, respectful Vietnamese (dùng danh xưng "King Man", gọi khách hàng là "Quý khách", dùng "dạ/vâng/ạ").
- IMPORTANT: Remember and use information the user shared earlier in the conversation (e.g. their name, preferences). If the user told you their name, address them by name naturally.
- If you suggest products, show 2-3 max with prices and links only.
- Reply naturally - don't be robotic. Skip unnecessary formatting.
- IMPORTANT: ALWAYS format links as Markdown links with CONTEXTUAL and NATURAL text. DO NOT use generic words like "Tại đây" repeatedly. Ví dụ ĐÚNG: "truy cập [trang Cửa hàng](/shop)", "thực hiện [thanh toán](/checkout)", "[Tên sản phẩm](/url)". Ví dụ SAI: "truy cập [Tại đây](/shop)". KHÔNG ĐƯỢC để đường link trơn (raw URL) trong câu.
- ALWAYS append the currency unit "VND" after prices. (Ví dụ: 3.920.000 VND).
- If you suggest a product, ALWAYS include its image using Markdown image syntax BEFORE the product link. Example: "\n![Tên sản phẩm](imageUrl)\n[Tên sản phẩm](/url) - Giá VND".
- ALWAYS end product recommendations with exactly this sentence: "Quý khách có thể tham khảo thêm nhiều mẫu tại [Cửa hàng](/shop) ạ!"
- For policies you don't know, just say "Dạ King Man không chắc chắn về thông tin này, Quý khách vui lòng để lại lời nhắn tại [trang Liên hệ](/contact) để được hỗ trợ thêm ạ!" instead of long explanations.

Knowledge context:
${sourceContext}

Product context:
${productContext}`.trim();
};

// Used only for fallback (non-AI) mode
const buildPrompt = (
  query: string,
  sources: ScoredKnowledgeSource[],
  suggestedProducts: SuggestedProduct[]
) => {
  return buildSystemPrompt(sources, suggestedProducts) + `\n\nUser question:\n${query}`;
};

interface HistoryMessage {
  sender: "user" | "ai";
  text: string;
}

const generateGroqReply = async (
  query: string,
  sources: ScoredKnowledgeSource[],
  suggestedProducts: SuggestedProduct[],
  history: HistoryMessage[] = []
): Promise<string | null> => {
  const groq = getGroqClient();
  if (!groq) {
    console.warn('GROQ_API_KEY is not set; falling back to non-AI response mode.');
    return null;
  }

  const systemPrompt = buildSystemPrompt(sources, suggestedProducts);

  // Build multi-turn messages: system + history + current user message
  const historyMessages: Array<{ role: "user" | "assistant"; content: string }> = history.map(
    (msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    })
  );

  try {
    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 800,
      temperature: 0.35,
      top_p: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        ...historyMessages,
        { role: "user", content: query }
      ]
    });

    const text = message.choices[0]?.message?.content?.trim() || "";
    return text || null;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error("Groq API error:", errorMessage);

    if (errorMessage.includes("rate_limit") || errorMessage.includes("quota")) {
      return "Dịch vụ AI đang quá tải hoặc đã hết hạn mức (quota); vui lòng thử lại sau vài phút.";
    }

    return null;
  }
};

const buildFallbackReply = (
  query: string,
  sources: ScoredKnowledgeSource[],
  suggestedProducts: SuggestedProduct[]
): string => {
  const parts = [];

  // Add helpful info from knowledge base
  if (sources.length > 0) {
    parts.push(
      "Dạ Quý khách có thể tham khảo thêm thông tin chi tiết:\n" +
        sources
          .slice(0, 2)
          .map((s) => `• [${s.title}](${s.url})`)
          .join("\n")
    );
  }

  // Add product suggestions if relevant
  if (suggestedProducts.length > 0) {
    parts.push(
      "Dạ King Man xin gợi ý một số sản phẩm phù hợp:\n" +
        suggestedProducts
          .slice(0, 2)
          .map((p) => `![${p.name}](${p.imageUrl})\n• [${p.name} (${p.price.toLocaleString()}đ)](${p.url})`)
          .join("\n\n")
    );
  }

  // Default response
  if (parts.length === 0) {
    parts.push("Dạ bộ phận chăm sóc khách hàng sẽ hỗ trợ Quý khách chi tiết hơn. Quý khách có thể để lại lời nhắn tại [trang Liên hệ](/contact) ạ! 😊");
  } else {
    parts.push("Quý khách cần King Man hỗ trợ thêm vấn đề gì khác không ạ?");
  }

  return parts.join("\n\n");
};

export const sendChatMessage = async (input: SendMessageInput) => {
  if (!input.message?.trim()) {
    throw new ApiError(400, "message is required");
  }

  let conversationId = input.conversationId;

  if (conversationId && !Types.ObjectId.isValid(conversationId)) {
    throw new ApiError(400, "Invalid conversation id");
  }

  if (conversationId) {
    const existingConversation = await AiConversationModel.findById(conversationId).lean();
    if (!existingConversation) {
      throw new ApiError(404, "Conversation not found");
    }

    if (input.userId && existingConversation.userId.toString() !== input.userId) {
      throw new ApiError(403, "Conversation does not belong to current user");
    }
  } else {
    const conversation = await AiConversationModel.create({
      userId: input.userId && Types.ObjectId.isValid(input.userId) ? input.userId : new Types.ObjectId(),
      title: "Styling session"
    });
    conversationId = conversation._id.toString();
  }

  // Load recent conversation history BEFORE saving the new user message
  // Keep last 20 messages (10 turns) to stay within token limits
  const recentMessages = conversationId
    ? await AiMessageModel.find({ conversationId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
    : [];

  const history: HistoryMessage[] = recentMessages
    .reverse()
    .map((msg) => ({
      sender: msg.sender as "user" | "ai",
      text: msg.text
    }));

  const userMessage = await AiMessageModel.create({
    conversationId,
    sender: "user",
    text: input.message.trim()
  });

  const retrieval = await runRetrieval(input.message);
  const replyText =
    (await generateGroqReply(input.message, retrieval.sources, retrieval.suggestedProducts, history)) ??
    buildFallbackReply(input.message, retrieval.sources, retrieval.suggestedProducts);

  const aiMessage = await AiMessageModel.create({
    conversationId,
    sender: "ai",
    text: replyText
  });

  return {
    conversationId,
    userMessage,
    aiMessage,
    sources: retrieval.sources.map((source) => ({
      id: source.id,
      title: source.title,
      kind: source.kind,
      url: source.url,
      snippet: source.snippet
    })),
    suggestedProducts: retrieval.suggestedProducts
  };
};
