import { Request, Response } from "express";
import RoleService from "../services/role.service";
import Logger from "../utils/logger.utils";
import { CustomError } from "../utils/customError.utils";
import { Types } from "mongoose";

export default class RoleController {
    private service = new RoleService();
    
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const role = await this.service.createRole(req.body);
            Logger.logger('Role criada com sucesso', 'role-controller', 'success');
            res.status(201).json({
                status: 'success',
                message: 'Role criada com sucesso',
                data: role
            });
        } catch (error: any) {
            if(error instanceof CustomError) {
                Logger.logger(`Erro ao criar role: ${error.message}`, 'role-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return
            }
            Logger.logger(`Erro interno do servidor ao criar role: ${error.message}`, 'role-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar role"
            });
        }
    }

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const role = await this.service.findAllRoles();
            res.status(200).json({
                status: 'success',
                message: 'Roles encontradas com successo',
                data: role
            });
        } catch (error: any) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return
            }
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar roles"
            });
        }
    }

    findById = async(req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }

            const id = new Types.ObjectId(req.params.id);
            const role = await this.service.findRoleById(id);

            if (!role) {
                throw new CustomError("Role não encontrado", 404);
            }

            res.status(200).json({
                status: "success",
                data: role
            });
        } catch (error: any) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return
            }
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar role"
            });
        }
    }

    update = async(req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }

            const id = new Types.ObjectId(req.params.id);
            const role = await this.service.updateRole(id, req.body);

            if (!role) {
                throw new CustomError("Role não encontrado", 404);
            }
            Logger.logger('Role atualizada com sucesso', 'role-controller', 'success');
            res.status(200).json({
                status: 'success',
                message: 'Role atualizada com sucesso',
                data: role
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar role: ${error.message}`, 'role-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            Logger.logger(`Erro interno do servidor ao atualizar role: ${error.message}`, 'role-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar role"
            });
        }
    }

    delete = async(req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }

            const id = new Types.ObjectId(req.params.id)
            const role = await this.service.deleteRole(id);

            if (!role) {
                throw new CustomError("Role não encontrado", 404);
            }
            Logger.logger('Role deletado com sucesso', 'role-controller', 'success');
            res.status(200).json({
                status: 'success',
                message: 'Role deletado com sucesso',
                data: role
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao deletar role: ${error.message}`, 'role-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            Logger.logger(`Erro interno do servidor ao deletar role: ${error.message}`, 'role-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar role"
            });
        }
    }
}