import { Types } from "mongoose";
import { IRoleInput, IRoleOutput, IRoleSearchParams } from "../interfaces/IRole.interface";
import RoleModel from "../models/role.model";

export default class RoleRepository {
    async create(dataModel: IRoleInput): Promise<IRoleOutput> {
        return await RoleModel.create(dataModel);
        
    }

    async findAll(): Promise<IRoleOutput[]> {
        return await RoleModel.find();
    }

    async findById(id: Types.ObjectId): Promise<IRoleOutput | null> {
        return await RoleModel.findById(id);
    }

    async findBy(data: IRoleSearchParams): Promise<IRoleOutput | IRoleOutput[] | null> {
        return await RoleModel.find(data);
    }

    async update(id: Types.ObjectId, dataModel: IRoleInput): Promise<IRoleOutput | null> {
        return await RoleModel.findByIdAndUpdate(id, dataModel, { new: true, runValidators: true });
    }

    async delete(id: Types.ObjectId): Promise<IRoleOutput | null> {
        return await RoleModel.findByIdAndDelete(id);
    }

}
