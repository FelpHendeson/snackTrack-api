import { Types } from "mongoose";
import CashRefillRepository from "../repositories/cashRefill.repository";
import { ICashRefillInput, ICashRefillOutput } from "../interfaces/ICashRefill.interface";
import { CustomError } from "../utils/customError.utils";

export default class CashRefillService {
    private repository = new CashRefillRepository();

    async create(data: ICashRefillInput, userId: Types.ObjectId): Promise<ICashRefillOutput> {
        try {

            if (!data.workspaceId) {
                throw new CustomError("Workspace é obrigatório", 400);
            }
            const refillData: ICashRefillInput = {
                ...data,
                createdBy: userId
            };

            const refill = await this.repository.create(refillData);
            if (!refill) {
                throw new CustomError("Erro ao criar reforço", 500);
            }

            return refill;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao criar reforço", 500);
        }
    }

    async findById(id: Types.ObjectId): Promise<ICashRefillOutput | null> {
        try {
            const refill = await this.repository.findById(id);
            if (!refill) {
                throw new CustomError("Reforço não encontrado", 404);
            }
            return refill;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao buscar reforço", 500);
        }
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<ICashRefillOutput[]> {
        try {
            return await this.repository.findAll(workspaceId);
        } catch (error: any) {
            throw new CustomError(error.message || "Erro ao buscar reforços", 500);
        }
    }

    async update(id: Types.ObjectId, data: Partial<ICashRefillInput>, userId: Types.ObjectId): Promise<ICashRefillOutput | null> {
        try {
            const refillExists = await this.repository.findById(id);
            if (!refillExists) {
                throw new CustomError("Reforço não encontrado", 404);
            }

            const updateData = {
                ...data,
                updatedBy: userId
            };

            const updatedRefill = await this.repository.update(id, updateData);
            if (!updatedRefill) {
                throw new CustomError("Erro ao atualizar reforço", 500);
            }

            return updatedRefill;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao atualizar reforço", 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const refillExists = await this.repository.findById(id);
            if (!refillExists) {
                throw new CustomError("Reforço não encontrado", 404);
            }

            await this.repository.delete(id);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao deletar reforço", 500);
        }
    }
}
