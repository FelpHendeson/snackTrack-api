import { Types } from "mongoose";
import CashRefillModel from "../models/cashRefill.model";
import { ICashRefillInput, ICashRefillOutput } from "../interfaces/ICashRefill.interface";

export default class CashRefillRepository {
    async create(data: ICashRefillInput): Promise<ICashRefillOutput> {
        return await CashRefillModel.create(data);
    }

    async findById(id: Types.ObjectId): Promise<ICashRefillOutput | null> {
        return await CashRefillModel.findById(id);
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<ICashRefillOutput[]> {
        if (workspaceId) {
            return await CashRefillModel.find({ workspaceId });
        }
        return await CashRefillModel.find();
    }

    async update(id: Types.ObjectId, data: Partial<ICashRefillInput>): Promise<ICashRefillOutput | null> {
        return await CashRefillModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await CashRefillModel.findByIdAndDelete(id);
    }
}
