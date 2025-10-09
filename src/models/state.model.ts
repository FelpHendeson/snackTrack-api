import { Schema, model, models } from 'mongoose';
import { IStateOutput } from '../interfaces/IState.interfaces';

const stateSchema = new Schema({
    name: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true }
}, {
    timestamps: true
});

const StateModel = models.State || model<IStateOutput>('State', stateSchema); 

export default StateModel;