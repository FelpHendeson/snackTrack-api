import { Schema, model, models } from 'mongoose';
import { ICityOutput } from '../interfaces/ICity.interface';

const citySchema = new Schema({
    name: { type: String, required: true, trim: true },
    state: { type: Schema.Types.ObjectId, ref: 'State', required: true }
}, {
    timestamps: true
});

citySchema.index({ state: 1, name: 1 }, { unique: true });

const CityModel = models.City || model<ICityOutput>('City', citySchema); 

export default CityModel;
