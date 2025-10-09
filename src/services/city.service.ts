import CityRepository from '../repositories/city.repository';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class CityService {
    private repository = new CityRepository();

    async create(data: any) {
        try {
            return await this.repository.create(data);
        } catch (error: any) {
            throw new CustomError(`Erro ao criar cidade: ${error.message}`, 500);
        }
    }

    async findById(id: Types.ObjectId) {
        try {
            return await this.repository.findById(id);
        } catch (error: any) {
            throw new CustomError("Erro ao buscar cidade", 500);
        }
    }

    async findAll() {
        try {
            return await this.repository.findAll();
        } catch (error: any) {
            throw new CustomError("Erro ao buscar cidades", 500);
        }
    }

    async update(id: Types.ObjectId, data: any) {
        try {
            return await this.repository.update(id, data);
        } catch (error: any) {
            throw new CustomError("Erro ao atualizar cidade", 500);
        }
    }

    async delete(id: Types.ObjectId) {
        try {
            return await this.repository.delete(id);
        } catch (error: any) {
            throw new CustomError("Erro ao deletar cidade", 500);
        }
    }
}
