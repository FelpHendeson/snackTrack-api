import { Schema, model, models } from "mongoose";
import { IMovementOutput } from "../interfaces/IMovement.interface";
import { FINANCIAL_MOVEMENT_TYPES } from "../constants/financialMovement.constants";

const movementSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    originId: { type: Schema.Types.ObjectId, ref: "Origin", required: true },
    value: { type: Number, required: true, min: [0.01, "Valor deve ser maior que zero"] },
    date: { type: Date, required: true },
    type: { type: String, enum: [...FINANCIAL_MOVEMENT_TYPES], required: true },
    description: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

movementSchema.index({ workspaceId: 1, date: 1 });
movementSchema.index({ originId: 1 });
movementSchema.index({ createdBy: 1 });

const MovementModel = models.Movement || model<IMovementOutput>("Movement", movementSchema);
export default MovementModel;
