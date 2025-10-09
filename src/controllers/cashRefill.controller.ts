import { Request, Response } from "express";
import CashRefillService from "../services/cashRefill.service";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError.utils";
import AuthService from "../services/auth.service";
import Logger from "../utils/logger.utils";

export default class CashRefillController {
    private service = new CashRefillService();
    private authService = new AuthService();

    create = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                throw new CustomError('Token não fornecido', 401);
            }

            const userData = this.authService.decodeToken(token);
            if (!Types.ObjectId.isValid(userData.id)) {
                throw new CustomError("ID inválido", 400);
            }
            
            const userId = new Types.ObjectId(userData.id);
            
            const refill = await this.service.create(req.body, userId);
            Logger.logger('Reforço criado com sucesso', 'cashRefill-controller', "success");
            res.status(201).json({ status: "success", message: 'Reforço criado com sucesso', data: refill });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar reforço: ${error.message}`, 'cashRefill-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar reforço: ${error.message}`, 'cashRefill-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar reforço"
            });
        }
    };

    findById = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            const refill = await this.service.findById(id);
            res.status(200).json({ status: "success", data: refill });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar reforço: ${error.message}`, 'cashRefill-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar reforço: ${error.message}`, 'cashRefill-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar reforço"
            });
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
            
            const refills = await this.service.findAll(new Types.ObjectId(workspaceId as string));
            res.status(200).json({ status: "success", data: refills });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar reforços: ${error.message}`, 'cashRefill-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar reforços: ${error.message}`, 'cashRefill-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar reforços"
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                throw new CustomError('Token não fornecido', 401);
            }

            const userData = this.authService.decodeToken(token);
            if (!Types.ObjectId.isValid(userData.id)) {
                throw new CustomError("ID inválido", 400);
            }
            
            const userId = new Types.ObjectId(userData.id);
            const id = new Types.ObjectId(req.params.id);
            
            const refill = await this.service.update(id, req.body, userId);
            Logger.logger('Reforço atualizado com sucesso', 'cashRefill-controller', "success");
            res.status(200).json({ status: "success", message: 'Reforço atualizado com sucesso', data: refill });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar reforço: ${error.message}`, 'cashRefill-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao atualizar reforço: ${error.message}`, 'cashRefill-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar reforço"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            await this.service.delete(id);
            Logger.logger('Reforço deletado com sucesso', 'cashRefill-controller', "success");
            res.status(200).json({ status: "success", message: "Reforço deletado com sucesso" });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao deletar reforço: ${error.message}`, 'cashRefill-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao deletar reforço: ${error.message}`, 'cashRefill-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar reforço"
            });
        }
    };
}
