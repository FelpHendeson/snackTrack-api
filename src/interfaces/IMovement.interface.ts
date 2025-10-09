import { Types } from "mongoose";

export interface IMovementInput {
    workspaceId: Types.ObjectId;
    originId: Types.ObjectId;
    value: number;
    date: Date;
    type: string;
    description?: string;
    createdBy: Types.ObjectId;
}

export interface IMovementOutput {
    _id: Types.ObjectId;
    workspaceId: Types.ObjectId;
    originId: Types.ObjectId;
    value: number;
    date: Date;
    type: string;
    description?: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}