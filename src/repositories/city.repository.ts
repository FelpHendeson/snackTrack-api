import CityModel from '../models/city.model';
import { Types } from 'mongoose';

export default class CityRepository {
    async create(data: any) {
        return await CityModel.create(data);
    }

    async findById(id: Types.ObjectId) {
        return await CityModel.findById(id).populate('state');
    }

    async findAll() {
        return await CityModel.find().populate('state');
    }

    async update(id: Types.ObjectId, data: any) {
        return await CityModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate('state');
    }

    async delete(id: Types.ObjectId) {
        return await CityModel.findByIdAndDelete(id);
    }
}
