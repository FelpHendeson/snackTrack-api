import { Schema, model, models } from 'mongoose';
import { ICountryOutput } from '../interfaces/ICountry.interface';

const countrySchema = new Schema({
    name: { type: String, required: true }
}, {
    timestamps: true
});

const CountryModel = models.Country || model<ICountryOutput>('Country', countrySchema); 

export default CountryModel;