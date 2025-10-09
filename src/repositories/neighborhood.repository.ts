import NeighborhoodModel from '../models/neighborhood.model';
import { Types } from 'mongoose';

export default class NeighborhoodRepository {
    async create(data: any) {
        return await NeighborhoodModel.create(data);
    }

    async findById(id: Types.ObjectId) {
        return await NeighborhoodModel.findById(id).populate('city');
    }

    async findAll() {
        return await NeighborhoodModel.find().populate('city');
    }

    async update(id: Types.ObjectId, data: any) {
        return await NeighborhoodModel.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('city');
    }

    async delete(id: Types.ObjectId) {
        return await NeighborhoodModel.findByIdAndDelete(id);
    }
}
