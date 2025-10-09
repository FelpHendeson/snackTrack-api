import { Command } from 'commander';
import DatabaseSeeder from './seeder';
import Logger from '../../utils/logger.utils';

const program = new Command();

program
    .version('1.0.0')
    .description('Seeder para o banco de dados do SnackTrack')
    .option('-c, --clear', 'Limpa o banco antes de popular')
    .option('-o, --only <type>', 'Executa apenas um tipo específico de seed (locations, roles, etc)')
    .option('-e, --env <environment>', 'Ambiente (development/production)', 'development')
    .action(async (options) => {
        try {
            // Aviso se rodar em produção
            if (options.env === 'production') {
                Logger.logger('⚠️ ATENÇÃO: Você está rodando o seed em PRODUÇÃO!', 'Seeder', 'warn');
            }

            Logger.logger(
                `Iniciando seed: ${options.only || 'todos'} (clear: ${!!options.clear})`,
                'Seeder',
                'info'
            );

            // Executar seeds individualmente ou todos
            if (options.only) {
                switch (options.only) {
                    case 'locations':
                        await DatabaseSeeder.seedLocations(options.clear);
                        break;
                    case 'roles':
                        await DatabaseSeeder.seedRoles(options.clear);
                        break;
                    default:
                        Logger.logger(`❌ Tipo de seed desconhecido: ${options.only}`, 'Seeder', 'error');
                        process.exit(1);
                }
            } else {
                await DatabaseSeeder.run();
            }

            Logger.logger('✅ Seed completado com sucesso!', 'Seeder', 'success');
            process.exit(0);
        } catch (error) {
            Logger.logger(`❌ Erro durante o processo de seed: ${error}`, 'Seeder', 'error');
            process.exit(1);
        }
    });

program.parse(process.argv);
