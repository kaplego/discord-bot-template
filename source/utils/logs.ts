import moment from 'moment';
import { fs } from '.';
import 'colors';

const LOG_FOLDER = process.env.LOG_FOLDER || './logs';

/**
 * Le gestionnaire de logs.
 */
export default class LogManager {
    /**
     * Les écouteurs d'événements.
     */
    public listeners: Map<keyof LogEvents, LogEvents[keyof LogEvents][]> =
        new Map([['logAdd', []]]);

    /**
     * La date de création du gestionnaire.
     */
    public logDate: Date;
    /**
     * Le nom du fichier de logs.
     */
    public logFile: string;

    /**
     * La liste complète des logs.
     */
    public logs: Map<number, Log> = new Map();

    constructor() {
        this.logDate = new Date();
        this.logFile =
            `${moment(this.logDate).format('DD-MM-YYYY_HH-mm-ss')}.log`;

        this.checkLogFolder();

        if (fs.readdirSync(`./${LOG_FOLDER}`).length > 10) {
            fs.unlinkSync(
                `./${LOG_FOLDER}/${
                    fs
                        .readdirSync('./logs')
                        .filter((f) => f.endsWith('.log'))[0]
                }`
            );
        }

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            '========== BEGIN LOG ==========\n'
        );
    }

    /**
     * Supprimer les caractères ANSI d'une chaîne de caractères.
     * @param message La chaîne de caractères à modifier.
     * @returns La chaîne de caractères sans les caractères ANSI.
     */
    private static removeANSI(message: string): string {
        return message.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/gu,
            ''
        );
    }

    /**
     * Formater un message de log.
     * @param level Le niveau de priorité du message.
     * @param message Le message à formater.
     * @returns Le message formaté.
     */
    private static logData(
        level: 'LOG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL',
        message: string
    ): Omit<Log, 'args'> {
        const date = moment();
        const dateString = date.format('YYYY-MM-DD HH:mm:ss.SSS ZZ');

        return {
            level,
            date: date.toDate(),
            dateString,
            paddedLevel: level.padEnd(8, ' '),
            message,
            textMessage: LogManager.removeANSI(message)
        };
    }

    /**
     * Vérifier l'existence du dossier de logs et du fichier de logs, et les créer si nécessaire.
     */
    private checkLogFolder(): void {
        if (!fs.existsSync(`./${LOG_FOLDER}`)) {
            fs.mkdirSync(`./${LOG_FOLDER}`);
        }

        if (!fs.existsSync(`./${LOG_FOLDER}/${this.logFile}`)) {
            fs.writeFileSync(`./${LOG_FOLDER}/${this.logFile}`, '');
        }
    }

    /**
     * Enregistrer un écouteur d'événement.
     * @param event L'événement à écouter.
     * @param listener La fonction à exécuter lors de l'appel de l'événement.
     * @returns Le gestionnaire de logs.
     */
    public addListener<E extends keyof LogEvents>(
        event: E,
        listener: LogEvents[E]
    ): this {
        const listeners = this.listeners.get(event) || [];
        listeners.push(listener);
        this.listeners.set(event, listeners);

        return this;
    }

    /**
     * Appeler un événement.
     * @param event L'événement écouté.
     * @param listener La fonction à ne plus exécuter lors de l'appel de l'événement.
     * @returns Le gestionnaire de logs.
     */
    private callListener(
        event: keyof LogEvents,
        data: Parameters<LogEvents[keyof LogEvents]>
    ): void {
        const listeners = this.listeners.get(event) || [];
        listeners.forEach((listener) => listener(...data));
    }

    /**
     * Enregistrer un message dans le fichier de logs et l'afficher dans la console.
     * @param message Le message à enregistrer.
     * @param args Les arguments à afficher dans la console.
     */
    public log(message: string, ...args: any[]): void {
        this.checkLogFolder();

        const log = {
            ...LogManager.logData('LOG', message),
            args
        };

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${log.dateString}] [${log.paddedLevel}] ${log.textMessage}\n`
        );

        this.logs.set(this.logs.size, log);

        this.callListener('logAdd', [log]);

        console.log(message, ...args);
    }

    /**
     * Enregistrer un message d'information dans le fichier de logs et l'afficher dans la console.
     *
     * **Priorité basse**
     * @param message Le message à enregistrer.
     * @param args Les arguments à afficher dans la console.
     */
    public info(message: string, ...args: any[]): void {
        this.checkLogFolder();

        const log = {
            ...LogManager.logData('INFO', message),
            args
        };

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${log.dateString}] [${log.paddedLevel}] ${log.textMessage}\n`
        );

        this.logs.set(this.logs.size, log);

        this.callListener('logAdd', [log]);

        console.info(message);
    }

    /**
     * Enregistrer un message d'avertissement dans le fichier de logs et l'afficher dans la console.
     *
     * **Priorité moyenne**
     * @param message Le message à enregistrer.
     * @param args Les arguments à afficher dans la console.
     */
    public warn(message: string, ...args: any[]): void {
        this.checkLogFolder();

        const log = {
            ...LogManager.logData('WARN', message),
            args
        };

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${log.dateString}] [${log.paddedLevel}] ${log.textMessage}\n`
        );

        this.logs.set(this.logs.size, log);

        this.callListener('logAdd', [log]);

        console.warn('[WARN]'.bgYellow.black, message);
    }

    /**
     * Enregistrer un message d'erreur dans le fichier de logs et l'afficher dans la console.
     *
     * **Priorité haute**
     * @param message Le message à enregistrer.
     * @param args Les arguments à afficher dans la console.
     */
    public error(message: string, ...args: any[]): void {
        this.checkLogFolder();

        const log = {
            ...LogManager.logData('ERROR', message),
            args
        };

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${log.dateString}] [${log.paddedLevel}] ${log.textMessage}\n`
        );

        this.logs.set(this.logs.size, log);

        this.callListener('logAdd', [log]);

        console.error('[ERROR]'.bgRed.white, message);
    }

    /**
     * Enregistrer un message d'erreur critique dans le fichier de logs et l'afficher dans la console.
     *
     * **Priorité très haute**
     * @param message Le message à enregistrer.
     * @param args Les arguments à afficher dans la console.
     */
    public critical(message: string, ...args: any[]): void {
        this.checkLogFolder();

        const log = {
            ...LogManager.logData('CRITICAL', String(message)),
            args
        };

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${log.dateString}] [${log.paddedLevel}] ${log.textMessage}\n`
        );
        this.logs.set(this.logs.size, log);
        this.callListener('logAdd', [log]);

        console.error('[CRITICAL]'.bgRed.white.bold, message);
    }
}
