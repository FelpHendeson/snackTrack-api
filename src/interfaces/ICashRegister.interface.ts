import { Types } from "mongoose";
import { IMovementOutput } from "./IMovement.interface";
import { ICashRefillOutput } from "./ICashRefill.interface";

export interface ICashRegisterInput {
    workspaceId: Types.ObjectId;
    openingDate: Date;
    description?: string;
    initialValue?: number;
    status?: "open" | "closed";
    finalValue?: number;
    balance?: number;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    autoLinkMovements?: boolean;
}

export interface ICashRegisterOutput {
    _id: Types.ObjectId;
    workspaceId: Types.ObjectId;
    openingDate: Date;
    description?: string;
    initialValue: number;
    finalValue: number;
    balance: number;
    status: "open" | "closed";
    movements: Types.Array<IMovementOutput>; // Conjunto de movimentações
    refills: Types.Array<ICashRefillOutput>; // <-- Referência opcional aos reforços de caixa
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
