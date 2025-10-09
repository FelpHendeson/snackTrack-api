import { Types } from "mongoose";
import CashRegisterRepository from "../repositories/cashRegister.repository";
import { ICashRegisterInput, ICashRegisterOutput } from "../interfaces/ICashRegister.interface";
import { CustomError } from "../utils/customError.utils";

export default class CashRegisterService {
    private repository = new CashRegisterRepository();

    async open(data: ICashRegisterInput): Promise<ICashRegisterOutput> {
        try {
            if (!data.workspaceId) {
                throw new CustomError("Workspace é obrigatório", 400);
            }

            const cashRegister = await this.repository.create({ 
                ...data, 
                status: "open", 
                finalValue: data.initialValue || 0, 
                balance: data.initialValue || 0 
            });

            if (!cashRegister) {
                throw new CustomError("Erro ao abrir caixa", 500);
            }

            if (data.autoLinkMovements) {
                return await this.autoLinkMovementsAndRefills(cashRegister, data.openingDate);
            }

            return cashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao abrir caixa", 500);
        }
    }

    async close(id: Types.ObjectId, updatedBy: Types.ObjectId, autoLinkBeforeClose: boolean = false): Promise<ICashRegisterOutput> {
        try {
            const cashRegister = await this.repository.findById(id);
            if (!cashRegister) {
                throw new CustomError("Caixa não encontrado", 404);
            }

            if (cashRegister.status === "closed") {
                throw new CustomError("Caixa já está fechado", 400);
            }

            if (autoLinkBeforeClose) {
                await this.manualAutoLink(id, updatedBy);
            }

            const updatedCashRegister = await this.repository.close(id, updatedBy);
            if (!updatedCashRegister) {
                throw new CustomError("Erro ao fechar caixa", 500);
            }

            return updatedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao fechar caixa", 500);
        }
    }

    async reopenCashRegister( cashRegisterId: Types.ObjectId, updatedBy: Types.ObjectId ): Promise<ICashRegisterOutput> {
        try {
            const cashRegisterExists: ICashRegisterOutput | null = await this.repository.findById(cashRegisterId);
            if (!cashRegisterExists) {
                throw new CustomError("Caixa não encontrado", 404);
            }
            if(cashRegisterExists.status == 'open') {
                throw new CustomError('Caixa já aberto', 404);
            }

            const reopenData = {
                status: 'open' as const,
                updatedBy: updatedBy
            };

            const reopenedCashRegister = await this.repository.update(cashRegisterId, reopenData);
            if (!reopenedCashRegister) {
                throw new CustomError("Erro ao reabrir caixa", 500);
            }

            return reopenedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao reabrir caixa", 500);
        }
    }

    async linkMovements( cashRegisterId: Types.ObjectId, movementIds: Types.ObjectId[], updatedBy: Types.ObjectId ): Promise<ICashRegisterOutput> {
        try {
            const cashRegisterExists: ICashRegisterOutput | null = await this.repository.findById(cashRegisterId);
            if (!cashRegisterExists) {
                throw new CustomError("Caixa não encontrado", 404);
            }
            if(cashRegisterExists.status == 'closed') {
                throw new CustomError('Apenas caixas abertos podem receber movimentações', 400);
            }

            const updatedCashRegister = await this.repository.linkMovements(cashRegisterId, movementIds, updatedBy);
            if (!updatedCashRegister) {
                throw new CustomError("Erro ao atualizar caixa", 500);
            }

            return updatedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao vincular movimentações", 500);
        }
    }

    async linkCashRefills( cashRegisterId: Types.ObjectId, refillIds: Types.ObjectId[], updatedBy: Types.ObjectId ): Promise<ICashRegisterOutput> {
        try {
            const cashRegisterExists: ICashRegisterOutput | null = await this.repository.findById(cashRegisterId);
            if (!cashRegisterExists) {
                throw new CustomError("Caixa não encontrado", 404);
            }
            if(cashRegisterExists.status == 'closed') {
                throw new CustomError('Apenas caixas abertos podem receber reforços', 400);
            }

            const updatedCashRegister = await this.repository.linkCashRefills(cashRegisterId, refillIds, updatedBy);
            if (!updatedCashRegister) {
                throw new CustomError("Erro ao atualizar caixa", 500);
            }

            return updatedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao vincular reforços", 500);
        }
    }

    async autoLinkMovementsAndRefills(cashRegister: ICashRegisterOutput, date: Date): Promise<ICashRegisterOutput> {
        try {
            const { movements, refills } = await this.repository.findByDate(
                cashRegister.workspaceId,
                date
            );

            if (movements.length === 0 && refills.length === 0) {
                return cashRegister;
            }

            let updatedCashRegister = cashRegister;
            if (movements.length > 0) {
                updatedCashRegister = await this.linkMovements(
                    cashRegister._id,
                    movements,
                    cashRegister.createdBy
                );
            }

            if (refills.length > 0) {
                updatedCashRegister = await this.linkCashRefills(
                    cashRegister._id,
                    refills,
                    cashRegister.createdBy
                );
            }

            return updatedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao vincular automaticamente movimentações e reforços", 500);
        }
    }

    async manualAutoLink(cashRegisterId: Types.ObjectId, updatedBy: Types.ObjectId): Promise<ICashRegisterOutput> {
        try {
            const cashRegister = await this.repository.findById(cashRegisterId);
            if (!cashRegister) {
                throw new CustomError("Caixa não encontrado", 404);
            }

            const updatedCashRegister = await this.repository.autoLinkMovementsAndRefills(cashRegisterId, updatedBy);
            if (!updatedCashRegister) {
                throw new CustomError("Erro ao realizar auto-link", 500);
            }

            return updatedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao realizar auto-link", 500);
        }
    }

    async findById(id: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        try {
            const cashRegister = await this.repository.findById(id);
            if (!cashRegister) {
                throw new CustomError("Caixa não encontrado", 404);
            }
            return cashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao buscar caixa", 500);
        }
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<ICashRegisterOutput[]> {
        try {
            return await this.repository.findAll(workspaceId);
        } catch (error: any) {
            throw new CustomError(error.message || "Erro ao buscar caixas", 500);
        }
    }

    async update(id: Types.ObjectId, data: Partial<ICashRegisterInput>, userId: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        try {
            const cashRegisterExists = await this.repository.findById(id);
            if (!cashRegisterExists) {
                throw new CustomError("Caixa não encontrado", 404);
            }

            const updateData = {
                ...data,
                updatedBy: userId
            };

            const updatedCashRegister = await this.repository.update(id, updateData);
            if (!updatedCashRegister) {
                throw new CustomError("Erro ao atualizar caixa", 500);
            }

            return updatedCashRegister;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao atualizar caixa", 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            const cashRegisterExists = await this.repository.findById(id);
            if (!cashRegisterExists) {
                throw new CustomError("Caixa não encontrado", 404);
            }

            await this.repository.delete(id);
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error.message || "Erro ao deletar caixa", 500);
        }
    }
}
