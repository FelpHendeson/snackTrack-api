import { Types } from "mongoose";

export interface IOriginInput {
    name: string;
    description?: string;
    type: string;
    workspaceId: Types.ObjectId;
    createdBy?: Types.ObjectId;
}

export interface IOriginOutput {
    _id: Types.ObjectId;
    name: string;
    description: string;
    type: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    workspaceId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}