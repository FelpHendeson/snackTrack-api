import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';
import Logger from '../utils/logger.utils';

class GitlabCommit {
    private branch: string;
    private version: string;

    constructor() {
        // Pega a branch dos argumentos ou usa 'dev' como padrão
        this.branch = process.argv[2] || 'dev';
        // Lê a versão do package.json
        const packageJson = JSON.parse(
            readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
        );
        this.version = packageJson.version;
    }

    private execCommand(command: string): string {
        try {
            return execSync(command, { encoding: 'utf-8' });
        } catch (error) {
            Logger.logger(`Erro ao executar comando: ${command}`, 'GitLab', 'error');
            throw error;
        }
    }

    private checkGitStatus(): void {
        // Verifica se há mudanças não commitadas
        const status = this.execCommand('git status --porcelain');
        if (!status.includes('dist/')) {
            if(this.branch != 'main') {
                Logger.logger('Nenhuma mudança detectada na pasta dist/', 'GitLab', 'error');
                process.exit(1);
            }
        }
    }

    private getCurrentBranch(): string {
        return this.execCommand('git rev-parse --abbrev-ref HEAD').trim();
    }

    private async run() {
        try {
            Logger.logger(`Iniciando processo de commit para a branch ${this.branch}`, 'GitLab', 'info');

            const currentBranch = this.getCurrentBranch();
            if (currentBranch !== this.branch) {
                Logger.logger(`Mudando para a branch ${this.branch}`, 'GitLab', 'info');
                this.execCommand(`git checkout ${this.branch}`);
            }

            this.checkGitStatus();

            Logger.logger('Adicionando arquivos compilados', 'GitLab', 'info');
            this.execCommand('git add dist/');

            const commitMessage = `build: atualização da build v${this.version}`;
            Logger.logger(`Criando commit: ${commitMessage}`, 'GitLab', 'info');
            this.execCommand(`git commit -m "${commitMessage}"`);

            Logger.logger('Enviando para o GitLab', 'GitLab', 'info');
            this.execCommand(`git push origin ${this.branch}`);

            Logger.logger('Build commitada e enviada com sucesso!', 'GitLab', 'success');
        } catch (error: any) {
            Logger.logger(`Erro durante o processo: ${error.message}`, 'GitLab', 'error');
            process.exit(1);
        }
    }

    static execute() {
        const instance = new GitlabCommit();
        instance.run();
    }
}

GitlabCommit.execute();
