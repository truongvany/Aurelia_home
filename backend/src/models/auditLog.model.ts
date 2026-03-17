import { Schema, model, type InferSchemaType } from "mongoose";

const auditLogSchema = new Schema(
  {
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true,
    collection: "audit_logs"
  }
);

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;
export const AuditLogModel = model("AuditLog", auditLogSchema);
