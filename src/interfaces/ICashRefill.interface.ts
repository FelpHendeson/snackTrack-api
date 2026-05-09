import { Types } from "mongoose";

export interface ICashRefillInput {
    workspaceId: Types.ObjectId;
    value: number;
    date: Date;
    description?: string;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}

export interface ICashRefillOutput {
    _id: Types.ObjectId;
    workspaceId: Types.ObjectId;
    value: number;
    date: Date;
    description?: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
