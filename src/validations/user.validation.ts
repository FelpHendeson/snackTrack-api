import { z } from "zod";
import { validationMessages as msg } from "../utils/validationMessages.utils";

export const createUserSchema = z.object({
    email: z.string()
        .trim()
        .min(1, msg.required("Email"))
        .email(msg.invalidEmail),

    firstName: z.string()
        .trim()
        .min(2, msg.minLength("Nome", 2))
        .max(50, msg.maxLength("Nome", 50))
        .refine(val => val === undefined || val.length > 0, msg.required("Nome")),

    lastName: z.string()
        .trim()
        .min(2, msg.minLength("Sobrenome", 2))
        .max(50, msg.maxLength("Sobrenome", 50))
        .refine(val => val.length > 0, msg.required("Sobrenome")),

    password: z.string()
        .trim()
        .min(6, msg.minLength("Senha", 6))
        .max(100, msg.maxLength("Senha", 100))
        .refine(val => val.length > 0, msg.required("Senha")),

    phone: z.string()
        .optional()
        .refine(
            val => val === undefined || /^[\d\s()-]+$/.test(val),
            "Formato de telefone inválido"
        ),

    address: z.object({
        street: z.string().trim().refine(val => val.length > 0, msg.required("street")),
        number: z.string().trim().refine(val => val.length > 0, msg.required("number")),
        neighborhood: z.string().trim().refine(val => val.length > 0, msg.required("neighborhood"))
    }).optional(),

    isOnline: z.boolean().default(false),
    isValid: z.boolean().default(true),
});

export const updateUserSchema = z.object({
    email: z.string()
        .optional()
        .refine(val => val === undefined || val.trim().length > 0, msg.required("Email")),

    firstName: z.string()
        .optional()
        .refine(val => val === undefined || val.trim().length > 0, msg.required("Nome")),

    lastName: z.string()
        .optional()
        .refine(val => val === undefined || val.trim().length > 0, msg.required("Sobrenome")),

    password: z.string()
        .optional()
        .refine(val => val === undefined || val.trim().length > 0, msg.required("Senha")),

    phone: z.string()
        .optional()
        .refine(
            val => val === undefined || val.trim().length > 0 || /^[\d\s()-]+$/.test(val),
            "Formato de telefone inválido"
        ),

    address: z.object({
        street: z.string()
            .optional()
            .refine(val => val === undefined || val.trim().length > 0, msg.required("street")),
        number: z.string()
            .optional()
            .refine(val => val === undefined || val.trim().length > 0 || val === "Sem Número", msg.required("number")),
        neighborhood: z.string()
            .optional()
            .refine(val => val === undefined || val.trim().length > 0, msg.required("neighborhood"))
    }).optional(),

    isOnline: z.boolean().optional(),
    isValid: z.boolean().optional(),
});

export type updateUserSchema = z.infer<typeof updateUserSchema>;
export type createUserSchema = z.infer<typeof createUserSchema>;