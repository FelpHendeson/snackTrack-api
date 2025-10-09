import { model, models, Schema } from "mongoose";
import { IRoleOutput } from "../interfaces/IRole.interface";

const roleSchema = new Schema(
    {   
        name: {
            type: String,
            required: true
        },
        permissions: {
            type: [String],
            required: true
        },
        modules: {
            type: [String],
            required: true
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
)

const RoleModel = models.Role || model<IRoleOutput>('Role', roleSchema);

export default RoleModel;