export const FINANCIAL_MOVEMENT_TYPES = ["entrada", "saida"] as const;

export type FinancialMovementType = (typeof FINANCIAL_MOVEMENT_TYPES)[number];

export function isFinancialMovementType(value: unknown): value is FinancialMovementType {
    return FINANCIAL_MOVEMENT_TYPES.includes(value as FinancialMovementType);
}
