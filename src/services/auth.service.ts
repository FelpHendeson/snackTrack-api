import { IAuth, ICredentials } from "../interfaces/IAuth.interface";
import UserRepository from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { authConfig } from "../config/settings.config";
import { CustomError } from "../utils/customError.utils";
import { ITokenPayload } from "../interfaces/ITokenPayload.interfaces";

export default class AuthService {
    private repository = new UserRepository();

    async login(data: ICredentials): Promise<{ token: string, refreshToken: string }> {
        try {
            const user = await this.repository.findByEmail(data.login);

            if (!user) {
                throw new CustomError('Email ou senha incorretos.', 400);
            }

            if (Array.isArray(user)) {
                throw new CustomError('Email ou senha incorretos.', 400);
            }

            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new CustomError('Email ou senha incorretos.', 400);
            }

            const tokenPayload = {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phone
            };

            const token = jwt.sign(
                tokenPayload, 
                authConfig.jwtSecret as Secret, 
                { expiresIn: authConfig.jwtExpiresIn } as SignOptions
            );
            const refreshToken = jwt.sign(
                { id: user._id },
                authConfig.refreshTokenSecret as Secret,
                { expiresIn: authConfig.refreshTokenExpiresIn } as SignOptions
            );

            return { token, refreshToken };

        } catch (error: any) {
            throw new CustomError("Erro ao logar usuário", 400);
        }
    };

    async refreshToken(oldRefreshToken: string): Promise<{ token: string, refreshToken: string }> {
        try {
            // Verificar se o refresh token é válido
            const decoded = jwt.verify(oldRefreshToken, authConfig.refreshTokenSecret as Secret) as any;
            
            const user = await this.repository.findById(decoded.id);
            
            if (!user || Array.isArray(user)) {
                throw new CustomError('Token inválido ou expirado.', 401);
            }

            // Gerar novo access token
            const tokenPayload = {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phone
            };

            const token = jwt.sign(
                tokenPayload,
                authConfig.jwtSecret as Secret,
                { expiresIn: authConfig.jwtExpiresIn } as SignOptions
            );

            // Gerar novo refresh token
            const refreshToken = jwt.sign(
                { id: user._id },
                authConfig.refreshTokenSecret as Secret,
                { expiresIn: authConfig.refreshTokenExpiresIn } as SignOptions
            );

            return { token, refreshToken };
        } catch (error: any) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new CustomError('Token inválido ou expirado.', 401);
            }
            throw new CustomError('Erro ao atualizar token.', 400);
        }
    }

    decodeToken(token: string): ITokenPayload {
        try {
            const decoded = jwt.verify(token, authConfig.jwtSecret as Secret) as ITokenPayload;
            return decoded;
        } catch (error: any) {
            throw new CustomError('Token inválido ou expirado.', 401);
        }
    }
}