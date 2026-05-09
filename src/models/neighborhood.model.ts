import { Schema, model, models } from 'mongoose';
import { INeighborhoodOutput } from '../interfaces/INeighborhood.interface';

const neighborhoodSchema = new Schema({
    name: { type: String, required: true, trim: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true }
}, {
    timestamps: true
});

neighborhoodSchema.index({ city: 1, name: 1 }, { unique: true });

const NeighborhoodModel = models.Neighborhood || model<INeighborhoodOutput>('Neighborhood', neighborhoodSchema); 

export default NeighborhoodModel;
