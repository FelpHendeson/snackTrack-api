import { Types } from "mongoose";
import { FinancialMovementType } from "../constants/financialMovement.constants";

export interface IOriginInput {
    name: string;
    description?: string;
    type: FinancialMovementType;
    workspaceId: Types.ObjectId;
    createdBy?: Types.ObjectId;
}

export interface IOriginOutput {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    type: FinancialMovementType;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    workspaceId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
