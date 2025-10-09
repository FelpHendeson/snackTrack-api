import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { CustomError } from "../utils/customError.utils";
import Logger from "../utils/logger.utils";

export default class AuthController {
    private service = new AuthService();

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.service.login(req.body);
            Logger.logger('Login realizado com sucesso', 'auth-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Login realizado com sucesso",
                data: user
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao realizar login: ${error.message}`, 'auth-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao realizar login: ${error.message}`, 'auth-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao realizar login"
            });
        }
    }

    refreshToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                throw new CustomError('Refresh token não fornecido.', 400);
            }

            const tokens = await this.service.refreshToken(refreshToken);
            Logger.logger('Token atualizado com sucesso', 'auth-controller', 'success');
            
            res.status(200).json({
                status: "success",
                message: "Token atualizado com sucesso",
                data: tokens
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao atualizar token: ${error.message}`, 'auth-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao atualizar token: ${error.message}`, 'auth-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar token"
            });
        }
    }
}