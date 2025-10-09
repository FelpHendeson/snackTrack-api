import { Schema, model, models } from 'mongoose';
import { IAddressOutput } from '../interfaces/IAddress.interface';

const addressSchema = new Schema({
    street: { type: String, required: true },
    number: { type: String, required: true },
    neighborhood: { type: Schema.Types.ObjectId, ref: 'Neighborhood', required: true }
}, {
    timestamps: true
});

const AddressModel = models.Address || model<IAddressOutput>('Address', addressSchema); 

export default AddressModel;