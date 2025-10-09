import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import Logger from "../utils/logger.utils";

export const validateSchema = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error: any) {
            if (error) {
                console.log(error);
                const errorMessages = error.errors.map((err: any) => err.message).join(", ") || "Erro interno do servidor";
                Logger.logger(`Erro ao validar entradas da requisição: ${errorMessages}`, 'validation-handler', 'error');
                res.status(400).json({
                    status: "error",
                    message: errorMessages
                });
                return;
            } else {
                Logger.logger(`Erro interno do servidor: ${error.message}`, 'validation-handler', 'error');
                res.status(500).json({
                    status: "error",
                    message: "Erro interno do servidor"
                });
                return;
            }
        }
    };
};
