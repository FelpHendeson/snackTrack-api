import { Types } from "mongoose";
import { FinancialMovementType } from "../constants/financialMovement.constants";

export interface IMovementInput {
    workspaceId: Types.ObjectId;
    originId: Types.ObjectId;
    value: number;
    date: Date;
    type: FinancialMovementType;
    description?: string;
    createdBy: Types.ObjectId;
}

export interface IMovementOutput {
    _id: Types.ObjectId;
    workspaceId: Types.ObjectId;
    originId: Types.ObjectId;
    value: number;
    date: Date;
    type: FinancialMovementType;
    description?: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
