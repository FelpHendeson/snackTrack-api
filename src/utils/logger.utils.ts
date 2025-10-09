import chalk from 'chalk';

const logColors = {
    success: chalk.green,
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.blue,
    default: chalk.white,
};

type loggerStatus = 'success' | 'error' | 'warn' | 'info' | '';


export default class Logger {

    private static formatData(): string {

        const dataObject = new Date();
        const dia = String(dataObject.getDate()).padStart(2, '0');
        const mes = String(dataObject.getMonth() + 1).padStart(2, '0');
        const ano = dataObject.getFullYear();
        const horas = String(dataObject.getHours()).padStart(2, '0');
        const minutos = String(dataObject.getMinutes()).padStart(2, '0');
        const segundos = String(dataObject.getSeconds()).padStart(2, '0');

        return `${dia}-${mes}-${ano} ${horas}:${minutos}:${segundos}`;
    }
    /**
     * Método logger que exibe uma mensagem customizada no terminal.
     *
     * @param {string} message - A mensagem a ser exibida no log.
     * @param {string} module - O modulo que está sendo realizado (exibido em UPPERCASE).
     * @param {loggerStatus} status - O status da operação, que define a cor do log (comparado em minúsculas).
     */
    public static logger(message: string, module: string, status: loggerStatus): void {

        const dataHora = this.formatData();

        const logColor = logColors[status.toLowerCase() as keyof typeof logColors] || logColors.default;

        console.log(
            logColor(`${message} - [${module.toUpperCase()}] - ${dataHora}`)
        );
    }

};