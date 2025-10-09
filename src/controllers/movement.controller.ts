import { Request, Response } from "express";
import MovementService from "../services/movement.service";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError.utils";
import AuthService from "../services/auth.service";
import Logger from "../utils/logger.utils";

export default class MovementController {
    private service = new MovementService();
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

            const movement = await this.service.create(req.body, userId);
            Logger.logger('Movimentação criada com sucesso', 'movement-controller', "success");
            res.status(201).json({ status: "success", message: 'Movimentação criada com sucesso', data: movement });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar movimentação: ${error.message}`, 'movement-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar movimentação: ${error.message}`, 'movement-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar movimentação"
            });
        }
    };

    findById = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            const movement = await this.service.findById(id);
            res.status(200).json({ status: "success", data: movement });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar movimentação: ${error.message}`, 'movement-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar movimentação: ${error.message}`, 'movement-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar movimentação"
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
            
            const movements = await this.service.findAll(new Types.ObjectId(workspaceId as string));
            res.status(200).json({ status: "success", data: movements });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar movimentações: ${error.message}`, 'movement-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar movimentações: ${error.message}`, 'movement-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar movimentações"
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
            
            const movement = await this.service.update(id, req.body, userId);
            Logger.logger('Movimentação atualizada com sucesso', 'movement-controller', "success");
            res.status(200).json({ status: "success", message: 'Movimentação atualizada com sucesso', data: movement });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar movimentação: ${error.message}`, 'movement-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao atualizar movimentação: ${error.message}`, 'movement-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar movimentação"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            await this.service.delete(id);
            Logger.logger("Movimentação deletada com sucesso", 'movement-controller', "success");
            res.status(200).json({ status: "success", message: "Movimentação deletada com sucesso" });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao deletar movimentação: ${error.message}`, 'movement-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao deletar movimentação: ${error.message}`, 'movement-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar movimentação"
            });
        }
    };
}
