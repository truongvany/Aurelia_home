import { Schema, model, type InferSchemaType } from "mongoose";

const aiMessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "AiConversation",
      required: true,
      index: true
    },
    sender: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: "ai_messages"
  }
);

export type AiMessageDocument = InferSchemaType<typeof aiMessageSchema>;
export const AiMessageModel = model("AiMessage", aiMessageSchema);
