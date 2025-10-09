import { Types } from "mongoose";
import OriginModel from "../models/origin.model";
import { IOriginInput, IOriginOutput } from "../interfaces/IOrigin.interface";

export default class OriginRepository {
    async create(data: IOriginInput): Promise<IOriginOutput> {
        return await OriginModel.create(data);
    }

    async findById(id: Types.ObjectId): Promise<IOriginOutput | null> {
        return await OriginModel.findById(id);
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<IOriginOutput[]> {
        if (workspaceId) {
            return await OriginModel.find({ workspaceId });
        }
        return await OriginModel.find();
    }

    async update(id: Types.ObjectId, data: Partial<IOriginInput>): Promise<IOriginOutput | null> {
        return await OriginModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await OriginModel.findByIdAndDelete(id);
    }
}
