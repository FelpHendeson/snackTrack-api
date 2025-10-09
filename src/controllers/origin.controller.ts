import { Request, Response } from "express";
import OriginService from "../services/origin.service";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError.utils";
import AuthService from "../services/auth.service";
import Logger from "../utils/logger.utils";

export default class OriginController {
    private service = new OriginService();
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
            
            const origin = await this.service.create(req.body, userId);

            Logger.logger('Origem criada com sucesso', 'origin-controller', "success");
            res.status(201).json({ status: "success", message: 'Origem criada com sucesso', data: origin });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar origem: ${error.message}`, 'origin-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar origem: ${error.message}`, 'origin-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar origem"
            });
        }
    };

    findById = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            const origin = await this.service.findById(id);
            res.status(200).json({ status: "success", data: origin });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar origem: ${error.message}`, 'origin-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar origem: ${error.message}`, 'origin-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar origem"
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
            
            const origins = await this.service.findAll(new Types.ObjectId(workspaceId as string));
            res.status(200).json({ status: "success", data: origins });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar origem: ${error.message}`, 'origin-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar origem: ${error.message}`, 'origin-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar origem"
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);

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
            
            const origin = await this.service.update(id, req.body, userId);

            Logger.logger('Origem atualizada com sucesso', 'origin-controller', "success");
            res.status(200).json({ status: "success", message: 'Origem atualizada com sucesso', data: origin });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar origem: ${error.message}`, 'origin-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao atualizar origem: ${error.message}`, 'origin-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar origem"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = new Types.ObjectId(req.params.id);
            await this.service.delete(id);

            Logger.logger('Origem deletada com sucesso', 'origin-controller', "success");
            res.status(200).json({ status: "success", message: "Origem deletada com sucesso" });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao deletar origem: ${error.message}`, 'origin-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao deletar origem: ${error.message}`, 'origin-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar origem"
            });
        }
    };
}
