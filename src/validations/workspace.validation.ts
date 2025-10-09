import { z } from 'zod';
import { validationMessages } from '../utils/validationMessages.utils';

export const membroSchema = z.object({
    user: z.string({
        required_error: validationMessages.required('User'),
        invalid_type_error: validationMessages.typeError('User', 'string')
    }).min(1, validationMessages.minLength('User', 1)),

    role: z.string({
        required_error: validationMessages.required('Role'),
        invalid_type_error: validationMessages.typeError('Role', 'string')
    }).min(1, validationMessages.minLength('Role', 1)),

    addedAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export const createWorkspaceSchema = z.object({
    name: z.string({
        required_error: validationMessages.required('Name'),
        invalid_type_error: validationMessages.typeError('Name', 'string')
    }).min(3, validationMessages.minLength('Name', 3)),
});

export const updateWorkspaceSchema = z.object({
    name: z.string({
        required_error: validationMessages.required('Name'),
        invalid_type_error: validationMessages.typeError('Name', 'string')
    }).min(3, validationMessages.minLength('Name', 3)).optional(),

    members: z.array(membroSchema).optional()
});

export const addMemberSchema = z.object({
    userId: z.string({
        required_error: validationMessages.required('ID do usuário')
    }),
    roleId: z.string({
        required_error: validationMessages.required('ID da role')
    })
});

export const workspaceIdSchema = z.object({
    id: z.string({
        required_error: validationMessages.required('ID do workspace')
    })
}); 

