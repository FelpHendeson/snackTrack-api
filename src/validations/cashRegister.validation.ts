import { z } from "zod";
import { validationMessages as msg } from "../utils/validationMessages.utils";

// Schema para abrir caixa
export const openCashRegisterSchema = z.object({
    workspaceId: z.string().min(1, msg.required("Workspace")),
    openingDate: z.coerce.date(),
    description: z.string().optional(),
    initialValue: z.number().min(0, "Valor inicial não pode ser negativo").optional(),
    autoLinkMovements: z.boolean().optional()
});

// Schema para vincular movimentações
export const linkMovementsSchema = z.object({
    movementIds: z.array(
        z.string().min(1, msg.required("ID da movimentação"))
    ).min(1, "É necessário pelo menos uma movimentação para vincular")
});

// Schema para vincular reforços
export const linkCashRefillsSchema = z.object({
    refillIds: z.array(
        z.string().min(1, msg.required("ID do reforço"))
    ).min(1, "É necessário pelo menos um reforço para vincular")
});

// Schema para atualizar caixa
export const updateCashRegisterSchema = z.object({
    description: z.string().optional(),
    initialValue: z.number().optional(),
    status: z.enum(["open", "closed"]).optional()
});

// Schema para buscar caixas por workspace
export const findAllCashRegistersSchema = z.object({
    workspaceId: z.string().min(1, msg.required("Workspace"))
});

// Schema para validar IDs de ObjectId
export const objectIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "ID inválido"
);

// Schema para validar datas
export const dateSchema = z.coerce.date().refine(
    (date) => !isNaN(date.getTime()),
    "Data inválida"
);

// Schema para validar valores monetários
export const moneyValueSchema = z.number().min(0, "Valor não pode ser negativo");

// Schemas de resposta
export const cashRegisterResponseSchema = z.object({
    status: z.enum(["success", "error"]),
    message: z.string().optional(),
    data: z.object({
        _id: z.string(),
        workspaceId: z.string(),
        openingDate: z.date(),
        description: z.string().optional(),
        initialValue: z.number().optional(),
        finalValue: z.number().optional(),
        balance: z.number(),
        status: z.string(),
        movements: z.array(z.any()).optional(),
        refills: z.array(z.any()).optional(),
        createdBy: z.string(),
        updatedBy: z.string().optional(),
        createdAt: z.date(),
        updatedAt: z.date()
    }).optional()
});

// Schema para validação de erro
export const errorResponseSchema = z.object({
    status: z.literal("error"),
    message: z.string()
});

// Schema para fechar caixa - Agora só precisa confirmar
export const closeCashRegisterSchema = z.object({
    autoLinkBeforeClose: z.boolean().optional().default(false)
});

// Schema para auto-link - Removido pois o ID vem na URL
export const autoLinkSchema = z.object({}); // Schema vazio, apenas para manter a estrutura
