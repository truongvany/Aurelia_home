import { Schema, model, type InferSchemaType } from "mongoose";

const inventoryLogSchema = new Schema(
  {
    productVariantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["seed", "manual_adjustment", "order", "restock"],
      required: true
    },
    delta: { type: Number, required: true },
    note: { type: String, default: "" }
  },
  {
    timestamps: true,
    collection: "inventory_logs"
  }
);

export type InventoryLogDocument = InferSchemaType<typeof inventoryLogSchema>;
export const InventoryLogModel = model("InventoryLog", inventoryLogSchema);
