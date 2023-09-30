import fs from 'fs';

const LOG_FOLDER = process.env.LOG_FOLDER || './logs';

export default class Logging {
    public logDate: Date;
    public logFile: string;

    constructor() {
        this.logDate = new Date();
        this.logFile =
            this.logDate
                .toLocaleString()
                .replace(/(\/|:)/g, '-')
                .replace(/ /g, '_') + '.log';

        this.checkLogFolder();

        if (fs.readdirSync(`./${LOG_FOLDER}`).length > 5) {
            fs.unlinkSync(`./${LOG_FOLDER}/${fs.readdirSync('./logs')[0]}`);
        }
    }

    private static removeANSI(message: string): string {
        return message.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ''
        );
    }

    private checkLogFolder(): void {
        if (!fs.existsSync(`./${LOG_FOLDER}`)) {
            fs.mkdirSync(`./${LOG_FOLDER}`);
        }

        if (!fs.existsSync(`./${LOG_FOLDER}/${this.logFile}`)) {
            fs.writeFileSync(`./${LOG_FOLDER}/${this.logFile}`, '');
        }
    }

    public log(message: string): void {
        this.checkLogFolder();

        const dateTimeString = this.logDate
            .toLocaleString()
            .replace(/\//g, '-');

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${dateTimeString}]   [LOG] ${Logging.removeANSI(message)}\n`
        );

        console.log(message);
    }

    public info(message: string): void {
        this.checkLogFolder();

        const dateTimeString = this.logDate
            .toLocaleString()
            .replace(/\//g, '-');

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${dateTimeString}]  [INFO] ${Logging.removeANSI(message)}\n`
        );

        console.info(message);
    }

    public warn(message: string): void {
        this.checkLogFolder();

        const dateTimeString = this.logDate
            .toLocaleString()
            .replace(/\//g, '-');

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${dateTimeString}]  [WARN] ${Logging.removeANSI(message)}\n`
        );

        console.warn(message);
    }

    public error(message: string): void {
        this.checkLogFolder();

        const dateTimeString = this.logDate
            .toLocaleString()
            .replace(/\//g, '-');

        fs.appendFileSync(
            `./${LOG_FOLDER}/${this.logFile}`,
            `[${dateTimeString}] [ERROR] ${Logging.removeANSI(message)}\n`
        );

        console.error(message);
    }
}
