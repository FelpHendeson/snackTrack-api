import Application from "./app";
import Logger from "./utils/logger.utils";

export default class Server {
    /**
     * Inicia o servidor encapsulando a lógica da aplicação principal.
     */
    public async runServer(): Promise<void> {
        const app = new Application();

        try {
            Logger.logger("Inicializando a aplicação...", "SERVER", "info");
            await app.init();
        } catch (error) {
            Logger.logger(`Falha crítica ao executar o servidor: ${error}`, "SERVER", "error");
            process.exit(1); // Encerra o processo em caso de erro crítico
        }
    }
}

const server = new Server();
server.runServer().catch(error => {
    Logger.logger(`Erro ao iniciar o servidor: ${error}`, "SERVER", "error");
    process.exit(1);
});