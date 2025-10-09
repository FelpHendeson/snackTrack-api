import { z } from "zod";

export const loginSchema = z.object({
    login: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
    refreshToken: z.string({
        required_error: "Refresh token é obrigatório",
        invalid_type_error: "Refresh token deve ser uma string"
    })
}); 