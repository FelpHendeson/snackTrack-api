import { Schema, model, Types, models } from "mongoose";
import { ICashRefillOutput } from "../interfaces/ICashRefill.interface";

const cashRefillSchema = new Schema(
  {
    workspaceId: { type: Types.ObjectId, ref: "Workspace", required: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const CashRefillModel = models.CashRefill || model<ICashRefillOutput>("CashRefill", cashRefillSchema);
export default CashRefillModel;
