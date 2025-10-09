import { Types } from "mongoose";
import { IUserInput, IUserOutput, IUserSearchParams } from "../interfaces/IUser.interfaces";
import UserModel from "../models/user.model";

export default class UserRepository {
    async create(data: IUserInput, addressId: Types.ObjectId): Promise<IUserOutput> 
    {
        const dataSetCreate = {
            ...data,
            address: addressId
        }
        return await UserModel.create(dataSetCreate);
    }

    async findById(id: Types.ObjectId): Promise<IUserOutput | null> {
        return await UserModel.findById(id);
    }

    async findByEmail(email: string): Promise<IUserOutput | null> {
        return await UserModel.findOne({email: email});
    }

    async findBy(data: IUserSearchParams): Promise<IUserOutput | IUserOutput[] | null> {
        return await UserModel.find(data);
    }

    async update(id: Types.ObjectId, userData: Partial<IUserInput>): Promise<IUserOutput | null> {
        return await UserModel.findByIdAndUpdate(id, userData, { new: true });
    };

    async delete(id: Types.ObjectId): Promise<IUserOutput | null> {
        return await UserModel.findByIdAndDelete(id);
    };


};