import { z } from "zod";

export const createStateSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    country: z.string().min(1, "País é obrigatório")
});

export const updateStateSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    country: z.string().min(1, "País é obrigatório").optional()
});
