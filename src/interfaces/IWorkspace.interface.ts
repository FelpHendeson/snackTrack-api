import { Types } from "mongoose";

export interface IMembro {
    user: Types.ObjectId;
    role: Types.ObjectId;
    addedAt?: Date;
    updatedAt?: Date;
};

export interface IWorkspaceInput {
   name: string;
   members: IMembro[];
};

export interface IWorkspaceOutput {
    _id: Types.ObjectId;
   name: string;
   members: Types.Array<IMembro>;
   createdAt: Date;
   updatedAt: Date;
};