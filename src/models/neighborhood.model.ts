import { Schema, model, models } from 'mongoose';
import { INeighborhoodOutput } from '../interfaces/INeighborhood.interface';

const neighborhoodSchema = new Schema({
    name: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true }
}, {
    timestamps: true
});

const NeighborhoodModel = models.Neighborhood || model<INeighborhoodOutput>('Neighborhood', neighborhoodSchema); 

export default NeighborhoodModel;