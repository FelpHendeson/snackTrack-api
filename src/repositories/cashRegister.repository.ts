import { Types } from "mongoose";
import CashRegisterModel from "../models/cashRegister.model";
import { ICashRegisterInput, ICashRegisterOutput } from "../interfaces/ICashRegister.interface";
import MovementModel from "../models/movement.model";
import CashRefillModel from "../models/cashRefill.model";
import { CustomError } from "../utils/customError.utils";

export default class CashRegisterRepository {
    async create(data: ICashRegisterInput): Promise<ICashRegisterOutput> {
        return await CashRegisterModel.create(data);
    }

    private async calculateBalance(cashRegister: ICashRegisterOutput): Promise<number> {
        // Busca todas as movimentações e reforços em uma única query
        const [movements, refills] = await Promise.all([
            MovementModel.find({
                _id: { $in: cashRegister.movements }
            }),
            CashRefillModel.find({
                _id: { $in: cashRegister.refills }
            })
        ]);

        // Calcula o saldo inicial
        let balance = cashRegister.initialValue || 0;

        // Adiciona os reforços
        refills.forEach(refill => {
            balance += refill.value;
        });

        // Adiciona/subtrai as movimentações
        movements.forEach(movement => {
            if (movement.type === "entrada") {
                balance += movement.value;
            } else if (movement.type === "saida") {
                balance -= movement.value;
            }
        });

        // Arredonda para 2 casas decimais
        return Math.round(balance * 100) / 100;
    }

    async linkMovements(cashRegisterId: Types.ObjectId, movementIds: Types.ObjectId[], updatedBy: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        const cashRegister = await CashRegisterModel.findById(cashRegisterId);
        if (!cashRegister) {
            throw new CustomError("Caixa não encontrado", 404);
        }

        // Adiciona as novas movimentações
        const updatedCashRegister = await CashRegisterModel.findByIdAndUpdate(
            cashRegisterId,
            {
                $addToSet: { movements: { $each: movementIds } },
                $set: { updatedBy }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');

        if (!updatedCashRegister) {
            return null;
        }

        // Recalcula o saldo
        const newBalance = await this.calculateBalance(updatedCashRegister);

        // Atualiza o saldo
        return await CashRegisterModel.findByIdAndUpdate(
            cashRegisterId,
            {
                $set: { 
                    balance: newBalance,
                    finalValue: newBalance
                }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');
    }

    async linkCashRefills(cashRegisterId: Types.ObjectId, refillIds: Types.ObjectId[], updatedBy: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        const cashRegister = await CashRegisterModel.findById(cashRegisterId);
        if (!cashRegister) {
            throw new CustomError("Caixa não encontrado", 404);
        }

        // Adiciona os novos reforços
        const updatedCashRegister = await CashRegisterModel.findByIdAndUpdate(
            cashRegisterId,
            {
                $addToSet: { refills: { $each: refillIds } },
                $set: { updatedBy }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');

        if (!updatedCashRegister) {
            return null;
        }

        // Recalcula o saldo
        const newBalance = await this.calculateBalance(updatedCashRegister);

        // Atualiza o saldo
        return await CashRegisterModel.findByIdAndUpdate(
            cashRegisterId,
            {
                $set: { 
                    balance: newBalance,
                    finalValue: newBalance
                }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');
    }

    async findById(id: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        return await CashRegisterModel.findById(id)
            .populate("movements")
            .populate("refills");
    }

    async findAll(workspaceId?: Types.ObjectId): Promise<ICashRegisterOutput[]> {
        if (workspaceId) {
            return await CashRegisterModel.find({ workspaceId })
                .populate("movements")
                .populate("refills");
        }
        return await CashRegisterModel.find()
            .populate("movements")
            .populate("refills");
    }

    async findByDate(workspaceId: Types.ObjectId, date: Date): Promise<{ movements: Types.ObjectId[], refills: Types.ObjectId[] }> {
        // Ajusta a data para o início do dia em UTC
        const startOfDay = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0, 0, 0, 0
        ));
        
        const endOfDay = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23, 59, 59, 999
        ));

        // // Log para debug
        // console.log('Parâmetros de busca:', {
        //     workspaceId: workspaceId.toString(),
        //     startOfDay: startOfDay.toISOString(),
        //     endOfDay: endOfDay.toISOString()
        // });

        // Busca movimentações
        const movements = await MovementModel.find({
            date: { $gte: startOfDay, $lt: endOfDay },
            workspaceId: workspaceId
        }).select('_id');

        // Busca reforços
        const refills = await CashRefillModel.find({
            workspaceId: workspaceId,
            date: { $gte: startOfDay, $lt: endOfDay }
        }).select('_id');

        // // Log para debug
        // console.log('Resultados da busca:', {
        //     movementsCount: movements.length,
        //     refillsCount: refills.length,
        //     refills: refills
        // });

        return {
            movements: movements.map(m => m._id),
            refills: refills.map(r => r._id)
        };
    }

    async update(id: Types.ObjectId, data: Partial<ICashRegisterInput>): Promise<ICashRegisterOutput | null> {
        return await CashRegisterModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .populate("movements")
            .populate("refills");
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await CashRegisterModel.findByIdAndDelete(id);
    }

    async autoLinkMovementsAndRefills(cashRegisterId: Types.ObjectId, updatedBy: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        const cashRegister = await this.findById(cashRegisterId);
        if (!cashRegister) {
            throw new CustomError("Caixa não encontrado", 404);
        }

        if (cashRegister.status === "closed") {
            throw new CustomError("Não é possível vincular movimentações em um caixa fechado", 400);
        }

        // Busca movimentações e reforços da data de abertura
        const { movements, refills } = await this.findByDate(
            cashRegister.workspaceId,
            cashRegister.openingDate
        );

        // Remove movimentações e reforços já vinculados
        const newMovements = movements.filter(
            m => !cashRegister.movements.some(existing => existing.toString() === m.toString())
        );
        const newRefills = refills.filter(
            r => !cashRegister.refills.some(existing => existing.toString() === r.toString())
        );

        // Se não houver novos registros, retorna o caixa atual
        if (newMovements.length === 0 && newRefills.length === 0) {
            return cashRegister;
        }

        // Atualiza o caixa com as novas movimentações e reforços
        const updatedCashRegister = await CashRegisterModel.findByIdAndUpdate(
            cashRegisterId,
            {
                $addToSet: {
                    movements: { $each: newMovements },
                    refills: { $each: newRefills }
                },
                $set: { updatedBy }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');

        if (!updatedCashRegister) {
            return null;
        }

        // Recalcula o saldo
        const newBalance = await this.calculateBalance(updatedCashRegister);

        // Atualiza o saldo
        return await CashRegisterModel.findByIdAndUpdate(
            cashRegisterId,
            {
                $set: { 
                    balance: newBalance,
                    finalValue: newBalance
                }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');
    }

    async close(id: Types.ObjectId, updatedBy: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        const cashRegister = await this.findById(id);
        if (!cashRegister) {
            throw new CustomError("Caixa não encontrado", 404);
        }

        if (cashRegister.status === "closed") {
            throw new CustomError("Caixa já está fechado", 400);
        }

        // Calcula o saldo final
        const finalBalance = await this.calculateBalance(cashRegister);

        // Atualiza o caixa com o saldo calculado
        return await CashRegisterModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: "closed",
                    finalValue: finalBalance,
                    balance: finalBalance,
                    updatedBy
                }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');
    }

    async reopenCashRegister(id: Types.ObjectId, updatedBy: Types.ObjectId): Promise<ICashRegisterOutput | null> {
        const cashRegister = await this.findById(id);
        if (!cashRegister) {
            throw new CustomError("Caixa não encontrado", 404);
        }

        // Recalcula o saldo ao reabrir
        const calculatedBalance = await this.calculateBalance(cashRegister);

        return await CashRegisterModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: "open",
                    balance: calculatedBalance,
                    updatedBy
                }
            },
            { new: true, runValidators: true }
        ).populate('movements').populate('refills');
    }
}
