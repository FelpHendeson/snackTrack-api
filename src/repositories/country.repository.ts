import CountryModel from '../models/country.model';
import { Types } from 'mongoose';

export default class CountryRepository {
    async create(data: any) {
        return await CountryModel.create(data);
    }

    async findById(id: Types.ObjectId) {
        return await CountryModel.findById(id);
    }

    async findAll() {
        return await CountryModel.find();
    }

    async update(id: Types.ObjectId, data: any) {
        return await CountryModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    }

    async delete(id: Types.ObjectId) {
        return await CountryModel.findByIdAndDelete(id);
    }
}
