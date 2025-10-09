import "dotenv/config";
import { IServer } from "../interfaces/server.interface";
import { IAuth } from "../interfaces/IAuth.interface";

export const serverConfig: IServer = {
    host: process.env.API_HOST || 'localhost',
    port: parseInt(process.env.API_PORT || '3333', 10),
    prefixAPI: process.env.API_PREFIX_PATH || '/snacktrack',
};

export const authConfig: IAuth = {
    jwtSecret: process.env.JWT_SECRET || 'dev', 
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '10h', 
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev', 
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN  || '10d'
}

export const dbConnectString: string = process.env.DB_CONNECT_STRING || '';
