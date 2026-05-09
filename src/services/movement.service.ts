import { Types } from "mongoose";
import MovementRepository from "../repositories/movement.repository";
import OriginRepository from "../repositories/origin.repository";
import { IMovementInput, IMovementOutput } from "../interfaces/IMovement.interface";
import { CustomError } from "../utils/customError.utils";
import { FinancialMovementType, isFinancialMovementType } from "../constants/financialMovement.constants";

export default class MovementService {
    private repository = new MovementRepository();
    private originRepository = new OriginRepository();

    private toObjectId(value: unknown, fieldName: string): Types.ObjectId {
        if (value instanceof Types.ObjectId) {
            return value;
        }

        if (typeof value === "string" && Types.ObjectId.isValid(value)) {
            return new Types.ObjectId(value);
        }

        if (value && typeof value === "object" && "_id" in value) {
            return this.toObjectId((value as { _id: unknown })._id, fieldName);
        }

        throw new CustomError(`${fieldName} invalido`, 400);
    }

    private async validateOriginForMovement(
        workspaceId: Types.ObjectId,
        originId: Types.ObjectId,
        movementType: FinancialMovementType
    ): Promise<void> {
        const origin = await this.originRepository.findById(originId);

        if (!origin) {
            throw new CustomError("Origem nao encontrada", 404);
        }

        const originWorkspaceId = this.toObjectId(origin.workspaceId, "Workspace da origem");

        if (originWorkspaceId.toString() !== workspaceId.toString()) {
            throw new CustomError("Origem nao pertence ao workspace informado", 400);
        }

        if (origin.type !== movementType) {
            throw new CustomError("Origem deve ter o mesmo tipo da movimentacao", 400);
        }
    }

    async create(data: IMovementInput, userId: Types.ObjectId): Promise<IMovementOutput> {
        try {
            if (!data.workspaceId) {
                throw new CustomError("Workspace e obrigatorio", 400);
            }

            if (!isFinancialMovementType(data.type)) {
                throw new CustomError("Tipo da movimentacao deve ser entrada ou saida", 400);
            }

            const workspaceId = this.toObjectId(data.workspaceId, "Workspace");
            const originId = this.toObjectId(data.originId, "Origem");

            await this.validateOriginForMovement(workspaceId, originId, data.type);

            const movementData: IMovementInput = {
                ...data,
                workspaceId,
                originId,
                createdBy: userId
            };

            const movement = await this.repository.create(movementData);
            if (!movement) {
                throw new CustomError("Erro ao criar movimentacao", 500);
            }

            return movement;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao criar movimentacao", 500);
        }
    }

    async findById(id: Types.ObjectId): Promise<IMovementOutput | null> {
        try {
            const movement = await this.repository.findById(id);
            if (!movement) {
                throw new CustomError("Movimentacao nao encontrada", 404);
            }
            return movement;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao buscar movimentacao", 500);
        }
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<IMovementOutput[]> {
        try {
            return await this.repository.findAll(workspaceId);
        } catch (error: any) {
            throw new CustomError(error.message || "Erro ao buscar movimentacoes", 500);
        }
    }

    async update(id: Types.ObjectId, data: Partial<IMovementInput>, userId: Types.ObjectId): Promise<IMovementOutput | null> {
        try {
            const movementExists = await this.repository.findById(id);
            if (!movementExists) {
                throw new CustomError("Movimentacao nao encontrada", 404);
            }

            const workspaceId = this.toObjectId(data.workspaceId ?? movementExists.workspaceId, "Workspace");
            const originId = this.toObjectId(data.originId ?? movementExists.originId, "Origem");
            const movementType = data.type ?? movementExists.type;

            if (!isFinancialMovementType(movementType)) {
                throw new CustomError("Tipo da movimentacao deve ser entrada ou saida", 400);
            }

            await this.validateOriginForMovement(workspaceId, originId, movementType);

            const updateData: Partial<IMovementInput> & { updatedBy: Types.ObjectId } = {
                ...data,
                updatedBy: userId
            };

            if (data.workspaceId) {
                updateData.workspaceId = workspaceId;
            }

            if (data.originId) {
                updateData.originId = originId;
            }

            const updatedMovement = await this.repository.update(id, updateData);
            if (!updatedMovement) {
                throw new CustomError("Erro ao atualizar movimentacao", 500);
            }

            return updatedMovement;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao atualizar movimentacao", 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const movementExists = await this.repository.findById(id);
            if (!movementExists) {
                throw new CustomError("Movimentacao nao encontrada", 404);
            }

            await this.repository.delete(id);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao deletar movimentacao", 500);
        }
    }
}
