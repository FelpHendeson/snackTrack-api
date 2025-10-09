import './cli';  // Se tiver argumentos CLI, usa a interface CLI
import DatabaseSeeder from './seeder';

// Se não tiver argumentos CLI, executa o seed padrão
if (process.argv.length === 2) {
    DatabaseSeeder.run()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}