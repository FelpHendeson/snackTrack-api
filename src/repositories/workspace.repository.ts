import { Types } from "mongoose";
import { IWorkspaceInput, IWorkspaceOutput } from "../interfaces/IWorkspace.interface";
import WorkspaceModel from "../models/workspace.model";

export default class WorkspaceRepository {
    async create(dataModel: IWorkspaceInput): Promise<IWorkspaceOutput> {
        return await WorkspaceModel.create(dataModel);
    }

    async findById(id: Types.ObjectId): Promise<IWorkspaceOutput | null> {
        return await WorkspaceModel.findById(id).populate('members.user').populate('members.role');
    }

    async addMember(workspaceId: Types.ObjectId, userId: Types.ObjectId, roleId: Types.ObjectId): Promise<IWorkspaceOutput | null> {
        return await WorkspaceModel.findByIdAndUpdate(
            workspaceId,
            {
                $push: {
                    members: {
                        user: userId,
                        role: roleId
                    }
                }
            },
            { new: true }
        ).populate('members.user').populate('members.role');
    }

    async findAll(): Promise<IWorkspaceOutput[]> {
        return await WorkspaceModel.find()
            .populate('members.user')
            .populate('members.role');
    }

    async update(id: Types.ObjectId, data: Partial<IWorkspaceInput>): Promise<IWorkspaceOutput | null> {
        return await WorkspaceModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        ).populate('members.user').populate('members.role');
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await WorkspaceModel.findByIdAndDelete(id);
    }

    async removeMember(workspaceId: Types.ObjectId, userId: Types.ObjectId): Promise<IWorkspaceOutput | null> {
        return await WorkspaceModel.findByIdAndUpdate(
            workspaceId,
            {
                $pull: {
                    members: { user: userId }
                }
            },
            { new: true }
        ).populate('members.user').populate('members.role');
    }

    async findByMemberId(userId: Types.ObjectId): Promise<IWorkspaceOutput[]> {
        return await WorkspaceModel.find({ 'members.user': userId })
            .populate('members.user')
            .populate('members.role');
    }
} 