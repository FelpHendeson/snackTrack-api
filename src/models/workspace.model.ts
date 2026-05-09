import { Schema, models, model } from "mongoose";
import { IWorkspaceOutput } from "../interfaces/IWorkspace.interface";

const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            role: {
                type: Schema.Types.ObjectId,
                ref: 'Role',
                required: true
            },
            addedAt: {
                type: Date,
                required: false,
                default: Date.now
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

workspaceSchema.index({ 'members.user': 1 });

const WorkspaceModel = models.Workspace || model<IWorkspaceOutput>('Workspace', workspaceSchema);

export default WorkspaceModel;
