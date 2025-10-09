import { Document, Types } from "mongoose";

export interface ICountryInput {
    name: string;
}

export interface ICountryOutput extends Document {
    _id: Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }
  