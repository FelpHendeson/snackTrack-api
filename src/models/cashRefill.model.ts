import { Schema, model, models } from "mongoose";
import { ICashRefillOutput } from "../interfaces/ICashRefill.interface";

const cashRefillSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    value: { type: Number, required: true, min: [0.01, "Valor deve ser maior que zero"] },
    date: { type: Date, required: true },
    description: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

cashRefillSchema.index({ workspaceId: 1, date: 1 });
cashRefillSchema.index({ createdBy: 1 });

const CashRefillModel = models.CashRefill || model<ICashRefillOutput>("CashRefill", cashRefillSchema);
export default CashRefillModel;
