import { Request, Response } from "express";
import CashRegisterService from "../services/cashRegister.service";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError.utils";
import AuthService from "../services/auth.service";
import Logger from "../utils/logger.utils";

export default class CashRegisterController {
    private service = new CashRegisterService();
    private authService = new AuthService();

    private getUserIdFromToken(req: Request): Types.ObjectId {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new CustomError('Token não fornecido', 401);
        }

        const userData = this.authService.decodeToken(token);
        if (!Types.ObjectId.isValid(userData.id)) {
            throw new CustomError("ID inválido", 400);
        }
        
        return new Types.ObjectId(userData.id);
    }

    private logOperation(operation: string, details: any) {
        Logger.logger(
            `Operação: ${operation} - Detalhes: ${JSON.stringify(details)}`,
            'cashRegister-controller',
            "info"
        );
    }

    private logError(operation: string, error: any) {
        Logger.logger(
            `Erro na operação: ${operation} - Erro: ${error.message}`,
            'cashRegister-controller',
            "error"
        );
    }

    open = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const cashRegisterData = {
                ...req.body,
                createdBy: userId
            };

            this.logOperation('Abertura de Caixa', { 
                workspaceId: cashRegisterData.workspaceId,
                initialValue: cashRegisterData.initialValue,
                autoLink: cashRegisterData.autoLinkMovements
            });

            const cashRegister = await this.service.open(cashRegisterData);
            
            this.logOperation('Caixa Aberto com Sucesso', {
                cashRegisterId: cashRegister._id,
                balance: cashRegister.balance
            });

            res.status(201).json({ 
                status: "success", 
                message: 'Caixa aberto com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.logError('Abertura de Caixa', error);
            this.handleError(error, res, 'abrir caixa');
        }
    };

    close = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const id = new Types.ObjectId(req.params.id);
            const { autoLinkBeforeClose } = req.body;

            this.logOperation('Fechamento de Caixa', {
                cashRegisterId: id,
                autoLink: autoLinkBeforeClose
            });

            const cashRegister = await this.service.close(id, userId, autoLinkBeforeClose);
            
            this.logOperation('Caixa Fechado com Sucesso', {
                cashRegisterId: cashRegister._id,
                finalBalance: cashRegister.balance,
                movementsCount: cashRegister.movements.length,
                refillsCount: cashRegister.refills.length
            });

            res.status(200).json({ 
                status: "success", 
                message: 'Caixa fechado com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.logError('Fechamento de Caixa', error);
            this.handleError(error, res, 'fechar caixa');
        }
    };

    reopen = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const id = new Types.ObjectId(req.params.id);

            const cashRegister = await this.service.reopenCashRegister(id, userId);
            Logger.logger('Caixa reaberto com sucesso', 'cashRegister-controller', "success");
            res.status(200).json({ 
                status: "success", 
                message: 'Caixa reaberto com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.handleError(error, res, 'reabrir caixa');
        }
    };

    linkMovements = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const id = new Types.ObjectId(req.params.id);
            const { movementIds } = req.body;

            const cashRegister = await this.service.linkMovements(
                id,
                movementIds.map((id: string) => new Types.ObjectId(id)),
                userId
            );
            Logger.logger('Movimentações vinculadas com sucesso', 'cashRegister-controller', "success");
            res.status(200).json({ 
                status: "success", 
                message: 'Movimentações vinculadas com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.handleError(error, res, 'vincular movimentações');
        }
    };

    linkCashRefills = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const id = new Types.ObjectId(req.params.id);
            const { refillIds } = req.body;

            const cashRegister = await this.service.linkCashRefills(
                id,
                refillIds.map((id: string) => new Types.ObjectId(id)),
                userId
            );
            Logger.logger('Reforços vinculados com sucesso', 'cashRegister-controller', "success");
            res.status(200).json({ 
                status: "success", 
                message: 'Reforços vinculados com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.handleError(error, res, 'vincular reforços');
        }
    };

    findById = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            const cashRegister = await this.service.findById(id);
            res.status(200).json({ status: "success", data: cashRegister });
        } catch (error: any) {
            this.handleError(error, res, 'buscar caixa');
        }
    };

    findAll = async (req: Request, res: Response) => {
        try {
            const { workspaceId } = req.query;
            if (!workspaceId) {
                throw new CustomError('Identificação do Workspace não fornecida', 401);
            }
            if (!Types.ObjectId.isValid(workspaceId as string)) {
                throw new CustomError('ID do Workspace inválido', 400);
            }
            
            const cashRegisters = await this.service.findAll(new Types.ObjectId(workspaceId as string));
            res.status(200).json({ status: "success", data: cashRegisters });
        } catch (error: any) {
            this.handleError(error, res, 'buscar caixas');
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const id = new Types.ObjectId(req.params.id);
            
            const cashRegister = await this.service.update(id, req.body, userId);
            Logger.logger('Caixa atualizado com sucesso', 'cashRegister-controller', "success");
            res.status(200).json({ 
                status: "success", 
                message: 'Caixa atualizado com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.handleError(error, res, 'atualizar caixa');
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            await this.service.delete(id);
            Logger.logger('Caixa deletado com sucesso', 'cashRegister-controller', "success");
            res.status(200).json({ 
                status: "success", 
                message: "Caixa deletado com sucesso" 
            });
        } catch (error: any) {
            this.handleError(error, res, 'deletar caixa');
        }
    };

    autoLink = async (req: Request, res: Response) => {
        try {
            const userId = this.getUserIdFromToken(req);
            const id = new Types.ObjectId(req.params.id);

            const cashRegister = await this.service.manualAutoLink(id, userId);
            Logger.logger('Auto-link realizado com sucesso', 'cashRegister-controller', "success");
            res.status(200).json({ 
                status: "success", 
                message: 'Auto-link realizado com sucesso', 
                data: cashRegister 
            });
        } catch (error: any) {
            this.handleError(error, res, 'realizar auto-link');
        }
    };

    private handleError(error: any, res: Response, action: string) {
        if (error instanceof CustomError) {
            this.logError(action, error);
            res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
            return;
        }
        this.logError(action, error);
        res.status(500).json({
            status: "error",
            message: `Erro interno do servidor ao ${action}`
        });
    }
}
