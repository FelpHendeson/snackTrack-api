import { Schema, model, models } from "mongoose";
import { IOriginOutput } from "../interfaces/IOrigin.interface";
import { FINANCIAL_MOVEMENT_TYPES } from "../constants/financialMovement.constants";

const originSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: [...FINANCIAL_MOVEMENT_TYPES], required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true }
  },
  { timestamps: true }
);

originSchema.index({ workspaceId: 1, type: 1 });
originSchema.index({ workspaceId: 1, name: 1 });
originSchema.index({ createdBy: 1 });

const OriginModel = models.Origin || model<IOriginOutput>("Origin", originSchema);
export default OriginModel;
