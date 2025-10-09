import { z } from "zod";
import { validationMessages as msg } from "../utils/validationMessages.utils";

export const createRoleSchema = z.object({
    name: z.string()
        .trim()
        .min(1, msg.required("Name"))
        .min(2, msg.minLength("Name", 2))
        .max(50, msg.maxLength("Name", 50)),

    permissions: z.array(
        z.string().trim().min(1, msg.emptyField("Permissions"))
    )
    .min(1, msg.required("Permissions"))
    .refine(val => val.length > 0, msg.emptyField("Permissions")),

    modules: z.array(
        z.string().trim().min(1, msg.emptyField("Modules"))
    )
    .min(1, msg.required("Modules"))
    .refine(val => val.length > 0, msg.emptyField("Modules")),

    description: z.string()
        .trim()
        .max(200, msg.maxLength("Description", 200))
        .optional()
});

export const updateRoleSchema = z.object({
    name: z.string()
        .trim()
        .min(2, msg.minLength("Name", 2))
        .max(50, msg.maxLength("Name", 50))
        .optional()
        .refine(
            val => val === undefined || val.trim().length > 0, 
            msg.emptyField("Name")
        ),

    permissions: z.array(
        z.string().trim().min(1, msg.emptyField("Permissions"))
    )
    .min(1, msg.required("Permissions"))
    .optional()
    .refine(
        val => val === undefined || (val && val.length > 0), 
        msg.emptyField("Permissions")
    ),

    modules: z.array(
        z.string().trim().min(1, msg.emptyField("Modules"))
    )
    .min(1, msg.required("Modules"))
    .optional()
    .refine(
        val => val === undefined || (val && val.length > 0), 
        msg.emptyField("Modules")
    ),

    description: z.string()
        .trim()
        .max(200, msg.maxLength("Description", 200))
        .optional()
        .refine(
            val => val === undefined || val.trim().length > 0, 
            msg.emptyField("Description")
        )
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;