import { Document, Types } from "mongoose";

export interface ICityInput {
  name: string;
  state: Types.ObjectId;
}


export interface ICityOutput extends Document {
  _id: Types.ObjectId;
  name: string;
  state: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
