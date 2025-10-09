import { z } from "zod";
import { validationMessages as msg } from "../utils/validationMessages.utils";

export const createOriginSchema = z.object({
    name: z.string().min(1, msg.required("Nome da origem")),
    description: z.string().optional(),
    type: z.string().min(1, msg.required("Tipo da origem")),
    workspaceId: z.string().min(1, msg.required("Workspace"))
});

export const updateOriginSchema = z.object({
    name: z.string().min(1, msg.required("Nome da origem")).optional(),
    description: z.string().optional(),
    type: z.string().min(1, msg.required("Tipo da origem")).optional()
});
