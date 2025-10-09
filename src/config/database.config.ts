import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import { dbConnectString } from './settings.config';
import Logger from '../utils/logger.utils';

// Verifica se a variável de ambiente foi carregada corretamente
const connectString = dbConnectString as string;

if (!connectString) {
    throw new Error('Defina a variável de ambiente DB_CONNECT_STRING dentro de .env');
}

// Interface para armazenar a conexão e a promessa de conexão
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Permite que o cache seja armazenado globalmente em ambientes Node.js
declare global {
    var mongoose: MongooseCache | undefined;
}

// Inicializa o cache de conexão com MongoDB
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
    cached = { conn: null, promise: null };
    global.mongoose = cached;
}

// Classe de conexão com o banco de dados
class Database {
    private static instance: Database;

    private constructor() { }

    // Implementação do padrão Singleton para garantir apenas uma instância
    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    // Método para conectar ao MongoDB
    async connectToDatabase(): Promise<Mongoose> {
        // Retorna a conexão existente se já estiver conectada
        if (cached.conn) {
            Logger.logger('Conexão com o MongoDB já estabelecida', 'Database', 'info');
            return cached.conn;
        }

        // Se não houver uma promessa de conexão, cria uma nova
        if (!cached.promise) {
            const opts: ConnectOptions = {
                bufferCommands: false, // Desativa o buffer de comandos até a conexão ser estabelecida
            };

            cached.promise = mongoose.connect(connectString, opts).then((mongoose) => {
                Logger.logger('Conexão com o MongoDB estabelecida', 'Database', 'success');
                return mongoose;
            }).catch((error) => {
                Logger.logger(`Erro ao conectar ao MongoDB: ${error.message}`, 'Database', 'error');
                throw error;
            });
        }

        // Atribui a conexão ao cache e retorna
        cached.conn = await cached.promise!;
        return cached.conn;
    }
}

// Exporta a instância da classe Database
const db = Database.getInstance();

export default db;