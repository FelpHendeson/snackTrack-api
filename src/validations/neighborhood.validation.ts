import { z } from "zod";

export const createNeighborhoodSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória")
});

export const updateNeighborhoodSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    city: z.string().min(1, "Cidade é obrigatória").optional()
});
