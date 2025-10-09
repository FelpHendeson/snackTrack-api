import AddressModel from '../models/address.model';
import { Types } from 'mongoose';

export default class AddressRepository {
    async create(data: any) {
        return await AddressModel.create(data);
    }

    async findById(id: Types.ObjectId) {
        return await AddressModel.findById(id).populate('neighborhood');
    }

    async findAll() {
        return await AddressModel.find().populate('neighborhood');
    }

    async update(id: Types.ObjectId, data: any) {
        return await AddressModel.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('neighborhood');
    }

    async delete(id: Types.ObjectId) {
        return await AddressModel.findByIdAndDelete(id);
    }
}
