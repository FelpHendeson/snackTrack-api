import { Types } from "mongoose";
import OriginRepository from "../repositories/origin.repository";
import { IOriginInput, IOriginOutput } from "../interfaces/IOrigin.interface";
import { CustomError } from "../utils/customError.utils";
import { isFinancialMovementType } from "../constants/financialMovement.constants";

export default class OriginService {
    private repository = new OriginRepository();

    async create(data: IOriginInput, userId: Types.ObjectId): Promise<IOriginOutput> {
        try {
            if (!data.workspaceId) {
                throw new CustomError("Workspace é obrigatório", 400);
            }

            if (!isFinancialMovementType(data.type)) {
                throw new CustomError("Tipo da origem deve ser entrada ou saida", 400);
            }

            const originData: IOriginInput = {
                ...data,
                createdBy: userId
            };

            const origin = await this.repository.create(originData);
            if (!origin) {
                throw new CustomError("Erro ao criar origem", 500);
            }

            return origin;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao criar origem", 500);
        }
    }

    async findById(id: Types.ObjectId): Promise<IOriginOutput | null> {
        try {
            const origin = await this.repository.findById(id);
            if (!origin) {
                throw new CustomError("Origem não encontrada", 404);
            }
            return origin;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao buscar origem", 500);
        }
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<IOriginOutput[]> {
        try {
            return await this.repository.findAll(workspaceId);
        } catch (error: any) {
            throw new CustomError(error.message || "Erro ao buscar origens", 500);
        }
    }

    async update(id: Types.ObjectId, data: Partial<IOriginInput>, userId: Types.ObjectId): Promise<IOriginOutput | null> {
        try {
            const originExists = await this.repository.findById(id);
            if (!originExists) {
                throw new CustomError("Origem não encontrada", 404);
            }

            if (data.type && !isFinancialMovementType(data.type)) {
                throw new CustomError("Tipo da origem deve ser entrada ou saida", 400);
            }

            const updateData = {
                ...data,
                updatedBy: userId
            };

            const updatedOrigin = await this.repository.update(id, updateData);
            if (!updatedOrigin) {
                throw new CustomError("Erro ao atualizar origem", 500);
            }

            return updatedOrigin;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao atualizar origem", 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const originExists = await this.repository.findById(id);
            if (!originExists) {
                throw new CustomError("Origem não encontrada", 404);
            }

            await this.repository.delete(id);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao deletar origem", 500);
        }
    }
}
