import db from '../../config/database.config';
import { Model } from 'mongoose';
import CountryModel from '../../models/country.model';
import StateModel from '../../models/state.model';
import CityModel from '../../models/city.model';
import NeighborhoodModel from '../../models/neighborhood.model';
import RoleModel from '../../models/role.model';
import { locationsData } from './data/locations.seed';
import { rolesData } from './data/roles.seed';
import Logger from '../../utils/logger.utils';

class DatabaseSeeder {
    private static async clearCollection(model: Model<any>, name: string) {
        try {
            await model.deleteMany({});
            Logger.logger(`Coleção ${name} limpa`, 'Seeder', 'info');
        } catch (error) {
            Logger.logger(`Erro ao limpar coleção ${name}: ${error}`, 'Seeder', 'error');
            throw error;
        }
    }

    static async clearAllCollections() {
        const collections = [
            { model: CountryModel, name: 'Countries' },
            { model: StateModel, name: 'States' },
            { model: CityModel, name: 'Cities' },
            { model: NeighborhoodModel, name: 'Neighborhoods' }
        ];

        for (const { model, name } of collections) {
            await this.clearCollection(model, name);
        }
    }

    static async seedLocations(shouldClear: boolean = false) {
        try {
            await db.connectToDatabase();
            
            if (shouldClear) {
                await this.clearAllCollections();
            }

            for (const countryData of locationsData) {
                const country = await CountryModel.create({ name: countryData.name });
                Logger.logger(`País criado: ${country.name}`, 'Seeder', 'info');

                for (const stateData of countryData.states) {
                    const state = await StateModel.create({
                        name: stateData.name,
                        country: country._id
                    });
                    Logger.logger(`Estado criado: ${state.name}`, 'Seeder', 'info');

                    for (const cityData of stateData.cities) {
                        const city = await CityModel.create({
                            name: cityData.name,
                            state: state._id
                        });
                        Logger.logger(`Cidade criada: ${city.name}`, 'Seeder', 'info');

                        for (const neighborhoodName of cityData.neighborhoods) {
                            await NeighborhoodModel.create({
                                name: neighborhoodName,
                                city: city._id
                            });
                            Logger.logger(`Bairro criado: ${neighborhoodName}`, 'Seeder', 'info');
                        }
                    }
                }
            }
            Logger.logger('Seed completado com sucesso!', 'Seeder', 'success');
        } catch (error) {
            Logger.logger(`Erro no processo de seed: ${error}`, 'Seeder', 'error');
            throw error;
        }
    }

    static async seedRoles(shouldClear: boolean = false) {
        try {
            await db.connectToDatabase();
    
            if (shouldClear) {
                await this.clearCollection(RoleModel, 'Roles');
            }
    
            for (const roleData of rolesData) {
                const role = await RoleModel.create(roleData);
                Logger.logger(`Role criada: ${role.name}`, 'Seeder', 'info');
            }
    
            Logger.logger('Seed de Roles completado com sucesso!', 'Seeder', 'success');
        } catch (error) {
            Logger.logger(`Erro no processo de seed de Roles: ${error}`, 'Seeder', 'error');
            throw error;
        }
    }

    static async run() {
        await this.seedLocations(true);
        await this.seedRoles(true);
    }
}

export default DatabaseSeeder;