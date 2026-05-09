import { z } from "zod";
import { FINANCIAL_MOVEMENT_TYPES } from "../constants/financialMovement.constants";
import { validationMessages as msg } from "../utils/validationMessages.utils";

export const createMovementSchema = z.object({
    workspaceId: z.string().min(1, msg.required("Workspace")),
    originId: z.string().min(1, msg.required("Origem")),
    value: z.number().min(0.01, msg.required("Valor")),
    date: z.coerce.date(),
    type: z.enum(FINANCIAL_MOVEMENT_TYPES, { required_error: msg.required("Tipo de movimentacao") }),
    description: z.string().optional()
});

export const updateMovementSchema = z.object({
    value: z.number().min(0.01, msg.emptyField("Valor")).optional(),
    originId: z.string().min(1, msg.emptyField("Origem")).optional(),
    date: z.coerce.date().optional(),
    type: z.enum(FINANCIAL_MOVEMENT_TYPES).optional(),
    description: z.string().optional()
});
