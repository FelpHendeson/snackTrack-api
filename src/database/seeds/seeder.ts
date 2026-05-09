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
            Logger.logger(`Colecao ${name} limpa`, 'Seeder', 'info');
        } catch (error) {
            Logger.logger(`Erro ao limpar colecao ${name}: ${error}`, 'Seeder', 'error');
            throw error;
        }
    }

    private static async upsertDocument(model: Model<any>, filter: Record<string, any>, data: Record<string, any>) {
        return await model.findOneAndUpdate(
            filter,
            { $set: data },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true
            }
        );
    }

    static async clearAllCollections() {
        const collections = [
            { model: NeighborhoodModel, name: 'Neighborhoods' },
            { model: CityModel, name: 'Cities' },
            { model: StateModel, name: 'States' },
            { model: CountryModel, name: 'Countries' }
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
                const country = await this.upsertDocument(
                    CountryModel,
                    { name: countryData.name },
                    { name: countryData.name }
                );
                Logger.logger(`Pais garantido: ${country.name}`, 'Seeder', 'info');

                for (const stateData of countryData.states) {
                    const state = await this.upsertDocument(
                        StateModel,
                        { name: stateData.name, country: country._id },
                        { name: stateData.name, country: country._id }
                    );
                    Logger.logger(`Estado garantido: ${state.name}`, 'Seeder', 'info');

                    for (const cityData of stateData.cities) {
                        const city = await this.upsertDocument(
                            CityModel,
                            { name: cityData.name, state: state._id },
                            { name: cityData.name, state: state._id }
                        );
                        Logger.logger(`Cidade garantida: ${city.name}`, 'Seeder', 'info');

                        for (const neighborhoodName of cityData.neighborhoods) {
                            await this.upsertDocument(
                                NeighborhoodModel,
                                { name: neighborhoodName, city: city._id },
                                { name: neighborhoodName, city: city._id }
                            );
                            Logger.logger(`Bairro garantido: ${neighborhoodName}`, 'Seeder', 'info');
                        }
                    }
                }
            }
            Logger.logger('Seed de localidades completado com sucesso!', 'Seeder', 'success');
        } catch (error) {
            Logger.logger(`Erro no processo de seed de localidades: ${error}`, 'Seeder', 'error');
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
                const role = await this.upsertDocument(
                    RoleModel,
                    { name: roleData.name },
                    roleData
                );
                Logger.logger(`Role garantida: ${role.name}`, 'Seeder', 'info');
            }

            Logger.logger('Seed de roles completado com sucesso!', 'Seeder', 'success');
        } catch (error) {
            Logger.logger(`Erro no processo de seed de roles: ${error}`, 'Seeder', 'error');
            throw error;
        }
    }

    static async run() {
        await this.seedLocations(true);
        await this.seedRoles(true);
    }
}

export default DatabaseSeeder;
