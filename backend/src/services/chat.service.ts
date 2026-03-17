import { Types } from "mongoose";
import { AiConversationModel } from "../models/aiConversation.model.js";
import { AiMessageModel } from "../models/aiMessage.model.js";
import { ApiError } from "../utils/ApiError.js";

interface SendMessageInput {
  userId?: string;
  message: string;
  conversationId?: string;
}

const buildAssistantReply = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes("wedding") || normalized.includes("formal")) {
    return "For formal events, start with a sharp blazer and neutral trousers, then add one statement accessory for balance.";
  }

  if (normalized.includes("coat") || normalized.includes("outerwear")) {
    return "For outerwear, choose a tailored silhouette in charcoal or navy so it layers easily across your wardrobe.";
  }

  if (normalized.includes("casual")) {
    return "For a refined casual look, pair knitwear with structured trousers and keep your palette to two main tones.";
  }

  return "Great choice. Share your preferred occasion, fit, and color palette and I can suggest a focused set of pieces.";
};

export const sendChatMessage = async (input: SendMessageInput) => {
  if (!input.message?.trim()) {
    throw new ApiError(400, "message is required");
  }

  let conversationId = input.conversationId;

  if (conversationId && !Types.ObjectId.isValid(conversationId)) {
    throw new ApiError(400, "Invalid conversation id");
  }

  if (!conversationId) {
    const conversation = await AiConversationModel.create({
      userId: input.userId && Types.ObjectId.isValid(input.userId) ? input.userId : new Types.ObjectId(),
      title: "Styling session"
    });
    conversationId = conversation._id.toString();
  }

  const userMessage = await AiMessageModel.create({
    conversationId,
    sender: "user",
    text: input.message.trim()
  });

  const replyText = buildAssistantReply(input.message);

  const aiMessage = await AiMessageModel.create({
    conversationId,
    sender: "ai",
    text: replyText
  });

  return {
    conversationId,
    userMessage,
    aiMessage
  };
};
