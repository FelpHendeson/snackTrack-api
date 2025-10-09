export const validationMessages = {
    required: (field: string) => `${field} é um campo obrigatório.`,
    minLength: (field: string, length: number) => `${field} deve ter no mínimo ${length} caracteres.`,
    maxLength: (field: string, length: number) => `${field} deve ter no máximo ${length} caracteres.`,
    invalidEmail: "Formato de e-mail inválido.",
    invalidDate: "Formato de data inválido. Use YYYY-MM-DD.",
    emptyField: (field: string) => `${field} não pode estar vazio.`,
    typeError: (field: string, fieldType: string) => `${field} deve ser do tipo ${fieldType}`
};