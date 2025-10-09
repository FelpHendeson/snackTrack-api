import { z } from "zod";

export const createCountrySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório")
});

export const updateCountrySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional()
});
