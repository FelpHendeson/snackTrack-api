import { z } from "zod";

export const createCitySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    state: z.string().min(1, "Estado é obrigatório")
});

export const updateCitySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    state: z.string().min(1, "Estado é obrigatório").optional()
});
