import { Locale } from 'discord.js';
import { asyncForEach, fs, throwError } from './utils';

type localesObject = {
    [key: string]: string | localesObject;
};

type LocalesMap = Map<Locale, localesObject>;

export class LocalesManager {
    protected locales: LocalesMap;
    public defaultLocale: Locale;

    constructor(defaultLocale: Locale) {
        this.defaultLocale = defaultLocale;
        this.locales = new Map();
    }

    public async load() {
        let folderName = process.env.LOCALES_FOLDER ?? 'locales';

        await asyncForEach(fs.readdirSync(folderName), async (filename) => {
            if (!filename.endsWith('.json')) return;
            let locale = filename.split('.')[0] as Locale;
            let file = await import(`../../${folderName}/${filename}`);
            this.locales.set(locale, file);
        });
    }

    public getOne(name: string, locale?: Locale): string {
        if (!locale) locale = this.defaultLocale;

        if (!this.locales.has(locale))
            locale = this.defaultLocale;

        let localeData = this.locales.get(locale);
        let value = name
            .split('.')
            .reduce((a, b) => (a !== null && b in a ? a[b] : null), localeData);

        if (value === null && locale !== this.defaultLocale)
            return this.getOne(
                name,
                this.defaultLocale
            );

        if (typeof value === 'string') return value;
        return null;
    }

    public get(name: string):
        | {
              [key in Locale]?: string;
          }
        | null {
        let value: Partial<Record<Locale, string>> = {};

        this.locales.forEach((locale, localeID) => {
            let currentVal = name
                .split('.')
                .reduce((a, b) => (a !== null && b in a ? a[b] : null), locale);

            if (typeof currentVal === 'string') value[localeID] = currentVal;
        });

        if (Object.keys(value).length === 0) return null;
        return value;
    }

    private baseObject(path: string) {
        let manager = this;
        return {
            getOne(name: string, locale?: Locale) {
                return manager.getOne(`${path}.${name}`, locale);
            },
            get(name: string) {
                return manager.get(`${path}.${name}`);
            }
        };
    }

    public command = (
        type: 'slash' | 'user' | 'message',
        commandName: string
    ) => ({
        ...this.baseObject(`commands.${type}.${commandName}`),
        option: (optionName: string) => ({
            ...this.baseObject(
                `commands.${type}.${commandName}.options.${optionName}`
            ),
            choice: (choiceName: string) =>
                this.baseObject(
                    `commands.${type}.${commandName}.options.${optionName}.choices.${choiceName}`
                )
        })
    });
}
