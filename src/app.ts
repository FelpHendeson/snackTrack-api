import { serverConfig } from "./config/settings.config";
import { IServer } from "./interfaces/server.interface";
import express, { Application as ExpressApp } from "express";
import cors from "cors";
import Logger from "./utils/logger.utils";    
import db from "./config/database.config";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import roleRoutes from "./routes/role.route";
import workspaceRoutes from "./routes/workspace.route";
import originRoutes from "./routes/origin.route";
import movementRoutes from "./routes/movement.route";
import cashRefilRoutes from "./routes/cashRefill.route";
import cashRegisterRoutes from "./routes/cashRegister.route";

export default class Application {
    // ?? Instância do Express 
    private app: ExpressApp;
    // ?? Configurações do servidor
    private serverConfig: IServer;
    // ?? Prefixo do sistema para que a url fique algo como http://host:port/prefixAPI/modulo
    private prefixAPI: string;

    constructor() {
        this.app = express();
        this.serverConfig = serverConfig;
        this.prefixAPI = serverConfig.prefixAPI;
    }

    public async init(): Promise<void> {
        try {
            // ?? Conexão com o banco de dados
            await db.connectToDatabase();
            Logger.logger('Conectado ao banco de dados com sucesso!', 'Server', 'success');

            // ?? Middlewares globais
            this.app.use(cors());
            this.app.use(express.json());
            this.app.use(express.urlencoded({ extended: true}));

            // ?? Rotas
            this.app.use(this.prefixAPI, userRoutes);
            this.app.use(this.prefixAPI, authRoutes);
            this.app.use(this.prefixAPI, roleRoutes);
            this.app.use(this.prefixAPI, workspaceRoutes);
            this.app.use(this.prefixAPI, originRoutes);
            this.app.use(this.prefixAPI, movementRoutes);
            this.app.use(this.prefixAPI, cashRefilRoutes);
            this.app.use(this.prefixAPI, cashRegisterRoutes);

            // ?? Middleware de tratamento de erros
            // this.app.use(errorHandler);

            // ?? Inicialização do servidor
            this.app.listen(this.serverConfig.port, this.serverConfig.host, () => {
                Logger.logger(
                    `Servidor rodando em http://${this.serverConfig.host}:${this.serverConfig.port}${this.prefixAPI}`,
                    'server',
                    'success'
                );
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                Logger.logger(`Erro ao iniciar a aplicação: ${error.message}`, 'server', 'error');
                Logger.logger(`${error.stack}`, 'server', 'error');
            } else {
                Logger.logger(`Erro ao iniciar a aplicação: ${error}`, 'server', 'error');
            }
            process.exit(1);
        }
    }
};