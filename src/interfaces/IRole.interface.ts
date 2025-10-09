import { Types } from "mongoose";

export interface IRoleInput {
    name: string;
    modules: string[];
    permissions: string[];
    description?: string; 
}

export interface IRoleOutput {
    _id: Types.ObjectId;
    name: string;
    modules: string[];
    permissions: string[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRoleSearchParams {
    name?: string;
    descricao?: string;
}