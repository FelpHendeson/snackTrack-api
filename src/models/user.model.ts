import { Schema, model, models } from 'mongoose';
import { IUserOutput } from '../interfaces/IUser.interfaces';

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: false, default: null },
    address: { type: Schema.Types.ObjectId, ref: 'Address', default: null },
    isOnline: { type: Boolean, default: false },
    isValid: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    lastWorkspace: { type: Schema.Types.ObjectId, ref: 'Workspace', default: null }
}, {
    timestamps: true
});

const UserModel = models.User || model<IUserOutput>('User', userSchema);

export default UserModel;
