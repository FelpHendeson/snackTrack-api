import { Document, Types } from "mongoose";

export interface IAddressInput {
    street: string;
    number: string;
    neighborhood: Types.ObjectId;
}

export interface IAddressOutput {
    _id: Types.ObjectId;
    street: string;
    number: string;
    neighborhood: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

