import { Types } from "mongoose";
import { IWorkspaceInput, IWorkspaceOutput } from "../interfaces/IWorkspace.interface";
import WorkspaceRepository from "../repositories/workspace.repository";
import { CustomError } from "../utils/customError.utils";
import RoleService from "./role.service";
import { IRoleOutput } from "../interfaces/IRole.interface";

export default class WorkspaceService {
    private repository = new WorkspaceRepository();
    private roleService = new RoleService();

    async createWorkspace(name: string, userId: Types.ObjectId): Promise<IWorkspaceOutput> {
        try {
            // Buscar a role padrão (pode ser 'owner' ou qualquer outra que você definir)
            const defaultRole: IRoleOutput | IRoleOutput[] | null = await this.roleService.findRoleBy({ name: 'Owner' });
            if (!Array.isArray(defaultRole) || defaultRole.length === 0) {
                throw new CustomError('Role padrão não encontrada', 400);
            }
            const roleId = defaultRole[0]._id;
            
            const workspace = await this.repository.create({
                name,
                members: [{
                    user: userId,
                    role: roleId,
                    addedAt: new Date()
                }]
            });

            return workspace;
        } catch (error: any) {
            console.error(error);
            throw new CustomError(`Erro ao criar workspace: ${error.message}`, 500);
        }
    }

    async addMember(workspaceId: Types.ObjectId, userId: Types.ObjectId, roleId: Types.ObjectId): Promise<IWorkspaceOutput | null> {
        try {
            const workspace = await this.repository.addMember(workspaceId, userId, roleId);
            if (!workspace) {
                throw new CustomError('Workspace não encontrado', 404);
            }
            return workspace;
        } catch (error: any) {
            throw new CustomError(`Erro ao adicionar membro: ${error.message}`, 500);
        }
    }

    async findAll(): Promise<IWorkspaceOutput[] | null> {
        try {
            return await this.repository.findAll();
        } catch (error: any) {
            throw new CustomError(`Erro ao buscar workspaces: ${error.message}`, 500);
        }
    }

    async findById(id: Types.ObjectId): Promise<IWorkspaceOutput  | null> {
        try {
            const workspace = await this.repository.findById(id);
            if (!workspace) {
                throw new CustomError('Workspace não encontrado', 404);
            }
            return workspace;
        } catch (error: any) {
            throw new CustomError(`Erro ao buscar workspace: ${error.message}`, error.statusCode || 500);
        }
    }

    async update(id: Types.ObjectId, data: Partial<IWorkspaceInput>): Promise<IWorkspaceOutput | null> {
        try {
            const workspace = await this.repository.update(id, data);
            if (!workspace) {
                throw new CustomError('Workspace não encontrado', 404);
            }
            return workspace;
        } catch (error: any) {
            throw new CustomError(`Erro ao atualizar workspace: ${error.message}`, error.statusCode || 500);
        }
    }

    async delete(id: Types.ObjectId): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error: any) {
            throw new CustomError(`Erro ao deletar workspace: ${error.message}`, 500);
        }
    }

    async removeMember(workspaceId: Types.ObjectId, userId: Types.ObjectId): Promise<IWorkspaceOutput | null> {
        try {
            const workspace = await this.repository.removeMember(workspaceId, userId);
            if (!workspace) {
                throw new CustomError('Workspace não encontrado', 404);
            }
            return workspace;
        } catch (error: any) {
            throw new CustomError(`Erro ao remover membro: ${error.message}`, error.statusCode || 500);
        }
    }

    async findByMemberId(userId: Types.ObjectId): Promise<IWorkspaceOutput[]> {
        try {
            const workspaces = await this.repository.findByMemberId(userId);
            return workspaces;
        } catch (error: any) {
            throw new CustomError(`Erro ao buscar workspaces do membro: ${error.message}`, error.statusCode || 500);
        }
    }
} 