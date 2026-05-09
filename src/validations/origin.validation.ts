import { z } from "zod";
import { FINANCIAL_MOVEMENT_TYPES } from "../constants/financialMovement.constants";
import { validationMessages as msg } from "../utils/validationMessages.utils";

export const createOriginSchema = z.object({
    name: z.string().min(1, msg.required("Nome da origem")),
    description: z.string().optional(),
    type: z.enum(FINANCIAL_MOVEMENT_TYPES, { required_error: msg.required("Tipo da origem") }),
    workspaceId: z.string().min(1, msg.required("Workspace"))
});

export const updateOriginSchema = z.object({
    name: z.string().min(1, msg.required("Nome da origem")).optional(),
    description: z.string().optional(),
    type: z.enum(FINANCIAL_MOVEMENT_TYPES).optional()
});
