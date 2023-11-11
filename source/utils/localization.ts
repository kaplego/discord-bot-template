import { DiscordTypes, asyncForEach, fs } from '.';

/**
 * La classe de gestion des traductions.
 */
export class LocalesManager {
    /** Les traductions chargées. */
    protected locales: LocalesMap;
    /** La langue par défaut. */
    public defaultLocale: DiscordTypes.Locale;

    /**
     * Créer un nouveau gestionnaire de traductions.
     * @param defaultLocale La langue par défaut.
     */
    constructor(defaultLocale: DiscordTypes.Locale) {
        this.defaultLocale = defaultLocale;
        this.locales = new Map();
    }

    /**
     * Initialiser le gestionnaire depuis le dossier des traductions.
     */
    public async load() {
        let folderName = process.env.LOCALES_FOLDER ?? 'locales';

        await asyncForEach(fs.readdirSync(folderName), async (filename) => {
            if (!filename.endsWith('.json')) return;
            let locale = filename.split('.')[0] as DiscordTypes.Locale;
            let file = await import(`../../${folderName}/${filename}`);
            this.locales.set(locale, file);
        });
    }

    /**
     * Obtenir la traduction dans une seule langue.
     * @param name Le nom de la traduction.
     * @param locale La langue de la traduction.
     * @returns La traduction, ou null si elle n'existe pas.
     */
    public getOne(name: string, locale?: DiscordTypes.Locale): string {
        if (!locale) locale = this.defaultLocale;

        if (!this.locales.has(locale)) locale = this.defaultLocale;

        let localeData = this.locales.get(locale);
        let value = name
            .split('.')
            .reduce((a, b) => (a !== null && b in a ? a[b] : null), localeData);

        if (value === null && locale !== this.defaultLocale)
            return this.getOne(name, this.defaultLocale);

        if (typeof value === 'string') return value;
        return null;
    }

    /**
     * Obtenir la traduction dans toutes les langues.
     * @param name Le nom de la traduction.
     * @returns Un objet contenant les traductions, avec comme clés les identifiants des langues.
     */
    public get(name: string):
        | {
              [key in DiscordTypes.Locale]?: string;
          }
        | null {
        let value: Partial<Record<DiscordTypes.Locale, string>> = {};

        this.locales.forEach((locale, localeID) => {
            let currentVal = name
                .split('.')
                .reduce((a, b) => (a !== null && b in a ? a[b] : null), locale);

            if (typeof currentVal === 'string') value[localeID] = currentVal;
        });

        if (Object.keys(value).length === 0) return null;
        return value;
    }

    /**
     * Obtenir un objet contenant des méthodes pour obtenir une traduction.
     * @param path Le chemin de la traduction.
     * @returns Un objet contenant des méthodes pour obtenir une traduction.
     */
    private baseObject(path: string) {
        let manager = this;
        return {
            getOne(name: string, locale?: DiscordTypes.Locale) {
                return manager.getOne(`${path}.${name}`, locale);
            },
            get(name: string) {
                return manager.get(`${path}.${name}`);
            }
        };
    }

    /**
     * Récupérer les traductions d'une commande.
     * @param type Le type de la commande (slash, user ou message).
     * @param commandName Le nom de la commande.
     * @returns Un objet contenant des méthodes pour obtenir les traductions de la commande.
     */
    public command = (
        type: 'slash' | 'user' | 'message',
        commandName: string
    ) =>
        ({
            ...this.baseObject(`commands.${type}.${commandName}`),
            option: (optionName: string) =>
                ({
                    ...this.baseObject(
                        `commands.${type}.${commandName}.options.${optionName}`
                    ),
                    choice: (choiceName: string) =>
                        this.baseObject(
                            `commands.${type}.${commandName}.options.${optionName}.choices.${choiceName}`
                        ) as ChoiceLocalesManager
                } as OptionLocalesManager)
        } as CommandLocalesManager);
}
