import "dotenv/config";
import { IServer } from "../interfaces/server.interface";
import { IAuth } from "../interfaces/IAuth.interface";

function normalizeJwtDuration(value: string | undefined, fallback: string, numericUnit: "h" | "d"): string {
    const normalized = value?.trim();
    if (!normalized) {
        return fallback;
    }

    if (/^\d+$/.test(normalized)) {
        return `${normalized}${numericUnit}`;
    }

    return normalized;
}

export const serverConfig: IServer = {
    host: process.env.API_HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'),
    port: parseInt(process.env.PORT || process.env.API_PORT || '3333', 10),
    prefixAPI: process.env.API_PREFIX_PATH || '/snacktrack',
};

export const authConfig: IAuth = {
    jwtSecret: process.env.JWT_SECRET || 'dev', 
    jwtExpiresIn: normalizeJwtDuration(process.env.JWT_EXPIRES_IN, '10h', 'h'), 
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev', 
    refreshTokenExpiresIn: normalizeJwtDuration(process.env.REFRESH_TOKEN_EXPIRES_IN, '10d', 'd')
}

export const dbConnectString: string = process.env.DB_CONNECT_STRING || '';
