import { Request, Response } from "express";
import WorkspaceService from "../services/workspace.service";
import { CustomError } from "../utils/customError.utils";
import { Types } from "mongoose";
import Logger from "../utils/logger.utils";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

export default class WorkspaceController {
    private service = new WorkspaceService();
    private authService = new AuthService();
    private userService = new UserService();

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;

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

            const workspace = await this.service.createWorkspace(name, userId);

            Logger.logger('Workspace criado com sucesso', 'workspace-controller', 'success');
            res.status(201).json({
                status: "success",
                message: "Workspace criado com sucesso",
                data: workspace
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar workspace: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar workspace: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar workspace"
            });
        }
    }

    addMember = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, roleId } = req.body;
            const workspaceId = new Types.ObjectId(req.params.id);

            const workspace = await this.service.addMember(
                workspaceId,
                new Types.ObjectId(userId),
                new Types.ObjectId(roleId)
            );

            res.status(200).json({
                status: "success",
                message: "Membro adicionado com sucesso",
                data: workspace
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao adicionar membro: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao adicionar membro: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao adicionar membro"
            });
        }
    }

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const workspaces = await this.service.findAll();

            res.status(200).json({
                status: "success",
                data: workspaces
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar workspaces: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar workspaces: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar workspaces"
            });
        }
    }

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = new Types.ObjectId(req.params.id);
            const workspace = await this.service.findById(id);

            // Atualiza o último workspace do usuário
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token) {
                const userData = this.authService.decodeToken(token);
                if (Types.ObjectId.isValid(userData.id)) {
                    await this.userService.updateLastWorkspace(
                        new Types.ObjectId(userData.id),
                        id
                    );
                }
            }

            res.status(200).json({
                status: "success",
                data: workspace
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar workspace: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar workspace: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar workspace"
            });
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = new Types.ObjectId(req.params.id);
            const workspace = await this.service.update(id, req.body);

            res.status(200).json({
                status: "success",
                message: "Workspace atualizado com sucesso",
                data: workspace
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar workspace: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao atualizar workspace: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar workspace"
            });
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = new Types.ObjectId(req.params.id);
            await this.service.delete(id);

            res.status(200).json({
                status: "success",
                message: "Workspace deletado com sucesso"
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao deletar workspace: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao deletar workspace: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar workspace"
            });
        }
    }

    removeMember = async (req: Request, res: Response): Promise<void> => {
        try {
            const workspaceId = new Types.ObjectId(req.params.id);
            const userId = new Types.ObjectId(req.params.userId);

            const workspace = await this.service.removeMember(workspaceId, userId);

            res.status(200).json({
                status: "success",
                message: "Membro removido com sucesso",
                data: workspace
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao remover membro: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao remover membro: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao remover membro"
            });
        }
    }

    findByMemberId = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = new Types.ObjectId(req.params.userId);
            const workspaces = await this.service.findByMemberId(userId);

            res.status(200).json({
                status: "success",
                data: workspaces
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao buscar workspaces do membro: ${error.message}`, 'workspace-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao buscar workspaces do membro: ${error.message}`, 'workspace-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar workspaces do membro"
            });
        }
    }
} 