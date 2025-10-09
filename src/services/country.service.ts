import CountryRepository from '../repositories/country.repository';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class CountryService {
    private repository = new CountryRepository();

    async create(data: any) {
        try {
            return await this.repository.create(data);
        } catch (error: any) {
            throw new CustomError(`Erro ao criar país: ${error.message}`, 500);
        }
    }

    async findById(id: Types.ObjectId) {
        try {
            return await this.repository.findById(id);
        } catch (error: any) {
            throw new CustomError("Erro ao buscar país", 500);
        }
    }

    async findAll() {
        try {
            return await this.repository.findAll();
        } catch (error: any) {
            throw new CustomError("Erro ao buscar países", 500);
        }
    }

    async update(id: Types.ObjectId, data: any) {
        try {
            return await this.repository.update(id, data);
        } catch (error: any) {
            throw new CustomError("Erro ao atualizar país", 500);
        }
    }

    async delete(id: Types.ObjectId) {
        try {
            return await this.repository.delete(id);
        } catch (error: any) {
            throw new CustomError("Erro ao deletar país", 500);
        }
    }
}
