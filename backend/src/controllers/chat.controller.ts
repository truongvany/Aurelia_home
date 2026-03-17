import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { sendChatMessage } from "../services/chat.service.js";

export const postChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const payload = await sendChatMessage({
    userId: req.user?.userId,
    message: req.body.message,
    conversationId: req.body.conversationId
  });

  sendSuccess(res, payload, "Message sent", 201);
});
