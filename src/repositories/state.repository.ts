import StateModel from '../models/state.model';
import { Types } from 'mongoose';

export default class StateRepository {
    async create(data: any) {
        return await StateModel.create(data);
    }

    async findById(id: Types.ObjectId) {
        return await StateModel.findById(id).populate('country');
    }

    async findAll() {
        return await StateModel.find().populate('country');
    }

    async update(id: Types.ObjectId, data: any) {
        return await StateModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate('country');
    }

    async delete(id: Types.ObjectId) {
        return await StateModel.findByIdAndDelete(id);
    }
}
