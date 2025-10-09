import { Document, Types } from "mongoose";

export interface INeighborhoodInput {
    name: string;
    city: Types.ObjectId;
}

export interface INeighborhoodOutput extends Document {
    _id: string;
    name: string;
    city: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}