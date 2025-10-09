import { Document, Types } from "mongoose";

export interface IStateInput {
    name: string;
    country: Types.ObjectId;
}

export interface IStateOutput extends Document {
    _id: Types.ObjectId;
    name: string;
    country: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}