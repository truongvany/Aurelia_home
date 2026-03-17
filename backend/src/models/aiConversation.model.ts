import { Schema, model, type InferSchemaType } from "mongoose";

const aiConversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "Styling session" }
  },
  {
    timestamps: true,
    collection: "ai_conversations"
  }
);

export type AiConversationDocument = InferSchemaType<typeof aiConversationSchema>;
export const AiConversationModel = model("AiConversation", aiConversationSchema);
