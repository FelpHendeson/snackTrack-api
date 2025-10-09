import { z } from "zod";
import { validationMessages as msg } from "../utils/validationMessages.utils";

export const createCashRefillSchema = z.object({
    workspaceId: z.string().min(1, msg.required("Workspace")),
    value: z.number().min(0.01, msg.required("Valor")),
    date: z.coerce.date(),
    description: z.string().optional()
});

export const updateCashRefillSchema = z.object({
    value: z.number().min(0.01, msg.required("Valor")).optional(),
    date: z.coerce.date().optional(),
    description: z.string().optional()
});
