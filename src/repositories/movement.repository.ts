import { Types } from "mongoose";
import MovementModel from "../models/movement.model";
import { IMovementInput, IMovementOutput } from "../interfaces/IMovement.interface";

export default class MovementRepository {
    async create(data: IMovementInput): Promise<IMovementOutput> {
        return await MovementModel.create(data);
    }

    async findById(id: Types.ObjectId): Promise<IMovementOutput | null> {
        return await MovementModel.findById(id).populate("originId");
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<IMovementOutput[]> {
        if (workspaceId) {
            return await MovementModel.find({ workspaceId }).populate("originId");
        }
        return await MovementModel.find().populate("originId");
    }

    async update(id: Types.ObjectId, data: Partial<IMovementInput>): Promise<IMovementOutput | null> {
        return await MovementModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate("originId");
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await MovementModel.findByIdAndDelete(id);
    }
}
