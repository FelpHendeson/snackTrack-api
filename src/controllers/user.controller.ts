import {Request, Response} from "express";
import UserService from "../services/user.service";
import Logger from "../utils/logger.utils";
import { CustomError } from "../utils/customError.utils";
import { Types } from "mongoose";
import { IUserSearchParams } from "../interfaces/IUser.interfaces";
export default class UserController {
    private service = new UserService();

    createUser = async (req: Request, res: Response): Promise<void> => 
    {
        try {
            const user = await this.service.createUser(req.body);
            Logger.logger('Usuário criado com sucesso', 'user-controller', 'success');
            res.status(201).json({
                status: "success",
                message: "Criado com sucesso",
                data: user
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar usuário: ${error.message}`, 'user-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar usuário: ${error.message}`, 'user-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar usuário"
            });

        }
    }

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }

            const id = new Types.ObjectId(req.params.id);
            const user = await this.service.findUserById(id);

            if (!user) {
                throw new CustomError("Usuário não encontrado", 404);
            }

            res.status(200).json({
                status: "success",
                data: user
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar usuário"
            });
        }
    }

    findByEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            let email: string = '';
            if (req.query.email) {
                email = req.query.email as string;
            }

            const user = await this.service.findUserByEmail(email);

            if (!user) {
                throw new CustomError("Usuário não encontrado", 404);
            }

            res.status(200).json({
                status: "success",
                data: user
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar usuário"
            });
        }
    }

    findBy = async (req: Request, res: Response): Promise<void> => {
        try {
            const searchParams: Partial<IUserSearchParams> = {};

            // Adiciona apenas os parâmetros que foram fornecidos
            if (req.query.firstName) searchParams.firstName = req.query.firstName as string;
            if (req.query.lastName) searchParams.lastName = req.query.lastName as string;
            if (req.query.phoneNumber) searchParams.phoneNumber = req.query.phoneNumber as string;

            // Valida se há parâmetros de busca
            if (Object.keys(searchParams).length === 0) {
                throw new CustomError("Pelo menos um parâmetro de busca deve ser fornecido", 400);
            }

            const users = await this.service.findUserBy(searchParams);

            if (!users || (Array.isArray(users) && users.length === 0)) {
                throw new CustomError("Nenhum usuário encontrado", 404);
            }

            res.status(200).json({
                status: "success",
                data: users
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                status: "error",
                message: "Erro interno ao buscar usuários"
            });
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const user = await this.service.updateUser(id, req.body);

            if (!user) {
                throw new CustomError("Usuário não encontrado", 404);
            }

            Logger.logger('Usuário atualizado com sucesso', 'user-controller', 'success');
            res.status(200).json({
                status: "success",
                data: user
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar usuário: ${error.message}`, 'user-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            Logger.logger(`Erro interno do servidor ao atualizar usuário: ${error.message}`, 'user-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar usuário"
            });
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }

            const id = new Types.ObjectId(req.params.id);
            const user = await this.service.deleteUser(id);

            if (!user) {
                throw new CustomError("Usuário não encontrado", 404);
            }

            Logger.logger('Usuário deletado com sucesso', 'user-controller', 'success');
            res.status(200).json({
                status: "success",
                data: user
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao deletar usuário: ${error.message}`, 'user-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }

            Logger.logger(`Erro interno do servidor ao deletar usuário: ${error.message}`, 'user-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar usuário"
            });
        }
    }

};