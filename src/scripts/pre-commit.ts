import { execSync } from 'child_process';
import Logger from '../utils/logger.utils';

try {
    // Verifica se há arquivos não compilados
    const status = execSync('git status --porcelain src/ dist/').toString();
    if (status) {
        Logger.logger('Arquivos fonte modificados, recompilando...', 'GitLab', 'info');
        execSync('npm run dist');
        execSync('git add dist/');
        Logger.logger('Arquivos recompilados e adicionados com sucesso', 'GitLab', 'success');
    }
} catch (error: any) {
    Logger.logger(`Erro no pre-commit: ${error.message}`, 'GitLab', 'error');
    process.exit(1);
}
