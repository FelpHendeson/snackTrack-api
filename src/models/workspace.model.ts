import { Schema, models, model, Types } from "mongoose";
import { IWorkspaceOutput } from "../interfaces/IWorkspace.interface";

const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [{
            user: {
                type: Types.ObjectId,
                ref: 'User',
                required: true
            },
            role: {
                type: Types.ObjectId,
                ref: 'Role',
                required: true
            },
            addedAt: {
                type: Date,
                required: false,
                default: new Date()
            },
            updatedAt: {
                type: Date,
                required: false
            }
        }]
    },
    {
        timestamps: true
    }
);

const WorkspaceModel = models.Workspace || model<IWorkspaceOutput>('Workspace', workspaceSchema);

export default WorkspaceModel;