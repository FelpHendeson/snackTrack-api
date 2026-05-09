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
            throw new CustomError('Token nao fornecido', 401);
        }

        req.user = jwt.verify(token, authConfig.jwtSecret as Secret) as ITokenPayload;
        next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            Logger.logger('Erro ao autenticar usuario: Token expirado', 'auth-controller', 'error');
            res.status(401).json({
                status: "error",
                message: "Token expirado"
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            Logger.logger('Erro ao autenticar usuario: Token invalido', 'auth-controller', 'error');
            res.status(403).json({
                status: "error",
                message: "Token invalido"
            });
            return;
        }

        if(error instanceof CustomError) {
            Logger.logger(`Erro ao autenticar usuario: ${error.message}`, 'auth-controller', 'error');
            res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
            return;
        }

        Logger.logger(`Erro interno do servidor ao autenticar usuario: ${error.message}`, 'auth-controller', 'error');
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor ao autenticar usuario"
        });
    }
};
