import { Types } from "mongoose";
import MovementRepository from "../repositories/movement.repository";
import { IMovementInput, IMovementOutput } from "../interfaces/IMovement.interface";
import { CustomError } from "../utils/customError.utils";

export default class MovementService {
    private repository = new MovementRepository();

    async create(data: IMovementInput, userId: Types.ObjectId): Promise<IMovementOutput> {
        try {
            if (!data.workspaceId) {
                throw new CustomError("Workspace é obrigatório", 400);
            }

            const movementData: IMovementInput = {
                ...data,
                createdBy: userId
            };

            const movement = await this.repository.create(movementData);
            if (!movement) {
                throw new CustomError("Erro ao criar movimentação", 500);
            }

            return movement;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao criar movimentação", 500);
        }
    }

    async findById(id: Types.ObjectId): Promise<IMovementOutput | null> {
        try {
            const movement = await this.repository.findById(id);
            if (!movement) {
                throw new CustomError("Movimentação não encontrada", 404);
            }
            return movement;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao buscar movimentação", 500);
        }
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<IMovementOutput[]> {
        try {
            return await this.repository.findAll(workspaceId);
        } catch (error: any) {
            throw new CustomError(error.message || "Erro ao buscar movimentações", 500);
        }
    }

    async update(id: Types.ObjectId, data: Partial<IMovementInput>, userId: Types.ObjectId): Promise<IMovementOutput | null> {
        try {
            const movementExists = await this.repository.findById(id);
            if (!movementExists) {
                throw new CustomError("Movimentação não encontrada", 404);
            }

            const updateData = {
                ...data,
                updatedBy: userId
            };

            const updatedMovement = await this.repository.update(id, updateData);
            if (!updatedMovement) {
                throw new CustomError("Erro ao atualizar movimentação", 500);
            }

            return updatedMovement;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao atualizar movimentação", 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const movementExists = await this.repository.findById(id);
            if (!movementExists) {
                throw new CustomError("Movimentação não encontrada", 404);
            }

            await this.repository.delete(id);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao deletar movimentação", 500);
        }
    }
}
