import { Types } from "mongoose";
import { IAddressInput, IAddressOutput } from "./IAddress.interface";
import { IWorkspaceOutput } from "./IWorkspace.interface";

export interface IUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    address?: IAddressInput;
    isOnline?: boolean;
    isValid?: boolean;
    lastWorkspace?: Types.ObjectId;
}

export interface IUserOutput {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string | null;
    address: Types.ObjectId | IAddressOutput | null;
    isOnline: boolean;
    isValid: boolean;
    emailVerifiedAt: Date | null;
    lastWorkspace: Types.ObjectId | IWorkspaceOutput | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserSearchParams {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}
