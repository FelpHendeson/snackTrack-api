import { z } from "zod";

export const createAddressSchema = z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    neighborhood: z.string().min(1, "Bairro é obrigatório")
});

export const updateAddressSchema = z.object({
    street: z.string().min(1, "Rua é obrigatória").optional(),
    number: z.string().min(1, "Número é obrigatório").optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório").optional()
});
