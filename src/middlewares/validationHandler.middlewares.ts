import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import Logger from "../utils/logger.utils";

type RequestSource = "body" | "query" | "params";

const formatValidationError = (error: unknown): string => {
    if (error instanceof ZodError) {
        return error.errors.map((err) => err.message).join(", ") || "Erro interno do servidor";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Erro interno do servidor";
};

const validateRequestSource = (schema: ZodSchema, source: RequestSource) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            (req as any)[source] = schema.parse((req as any)[source]);
            next();
        } catch (error: unknown) {
            const errorMessage = formatValidationError(error);
            Logger.logger(`Erro ao validar entradas da requisicao: ${errorMessage}`, "validation-handler", "error");
            res.status(400).json({
                status: "error",
                message: errorMessage
            });
            return;
        }
    };
};

export const validateSchema = (schema: ZodSchema) => validateRequestSource(schema, "body");
export const validateQuerySchema = (schema: ZodSchema) => validateRequestSource(schema, "query");
export const validateParamsSchema = (schema: ZodSchema) => validateRequestSource(schema, "params");
