import { Schema, model, Types, models } from "mongoose";
import { IMovementOutput } from "../interfaces/IMovement.interface";

const movementSchema = new Schema(
  {
    workspaceId: { type: Types.ObjectId, ref: "Workspace", required: true },
    originId: { type: Types.ObjectId, ref: "Origin", required: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true }, // "entrada" ou "saida"
    description: { type: String },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const MovementModel = models.Movement || model<IMovementOutput>("Movement", movementSchema);
export default MovementModel;
