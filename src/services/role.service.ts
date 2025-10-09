import { Types } from "mongoose";
import { IRoleInput, IRoleOutput, IRoleSearchParams } from "../interfaces/IRole.interface";
import RoleRepository from "../repositories/role.repository";
import { CustomError } from "../utils/customError.utils";

export default class RoleService {
    private repository = new RoleRepository;

    async createRole(data: IRoleInput): Promise<IRoleOutput> {
        try {
            return await this.repository.create(data);
        } catch (error: any) {
            throw new CustomError(`Erro ao criar role`, 500);
        }
    }

    async findAllRoles(): Promise<IRoleOutput[]> {
        try {
            return await this.repository.findAll();
        } catch (error: any) {
            throw new CustomError('Erro ao buscar roles', 500);
        }
    }

    async findRoleById(id: Types.ObjectId): Promise<IRoleOutput | null> {
        try {
            return await this.repository.findById(id);
        } catch (error: any) {
            throw new CustomError('Erro ao buscar role', 500);
        }
    }

    async findRoleBy(data: IRoleSearchParams): Promise<IRoleOutput | IRoleOutput[] | null> {
        try {
            const query = Object.entries(data).reduce((index, [key, value]) => {
                if (value) {
                    if (key === 'phoneNumber') {
                        index[key] = value;
                    } else {
                        index[key] = { $regex: value, $options: 'i' };
                    }
                }
                return index;
            }, {} as Record<string, any>);

            return await this.repository.findBy(query);
        } catch (error: any) {
            throw new CustomError("Erro ao buscar usuário", 500);
        }
    }

    async updateRole(id: Types.ObjectId, data: IRoleInput): Promise<IRoleOutput | null> {
        try {
            return await this.repository.update(id, data);
        } catch (error: any) {
            throw new CustomError('Erro ao atualizar role', 500);
        }
    }

    async deleteRole(id: Types.ObjectId): Promise<IRoleOutput | null> {
        try {
            return await this.repository.delete(id);
        } catch (error: any) {
            throw new CustomError('Erro ao deletar role', 500);
        }
    }
}