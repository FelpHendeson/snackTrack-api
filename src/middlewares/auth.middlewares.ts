import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { CustomError } from '../utils/customError.utils';
import Logger from '../utils/logger.utils';
import { authConfig } from '../config/settings.config';
import { ITokenPayload } from '../interfaces/ITokenPayload.interfaces';
import { ICustomRequest } from '../interfaces/ICustomRequest.interface';

export const authenticateToken = (req: ICustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new CustomError('Token não fornecido', 401);
        }

        jwt.verify(token, authConfig.jwtSecret as Secret, (err, decoded) => {
            if (err) {
                throw new CustomError('Token inválido', 403);
            }
            req.user = decoded as ITokenPayload;
            next();
        });
    } catch (error: any) {
        if(error instanceof CustomError) {
            Logger.logger(`Erro ao autenticar usuário: ${error.message}`, 'auth-controller', 'error');
            res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
            return;
        }

        Logger.logger(`Erro interno do servidor ao realizar login: ${error.message}`, 'auth-controller', 'error');
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor ao autenticar usuário"
        });
    }
};
