import { Schema, model, Types, models } from "mongoose";
import { IOriginOutput } from "../interfaces/IOrigin.interface";

const originSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    workspaceId: { type: Types.ObjectId, ref: "Workspace", required: true }
  },
  { timestamps: true }
);

const OriginModel = models.Origin || model<IOriginOutput>("Origin", originSchema);
export default OriginModel;
