import { Discord, fs, type Bot } from '../types';
import { asyncForEach } from './utils';
import { logging } from '..';

/** Le chemin vers le dossier du code complié, à partir de la racine du projet. */
const BUILD_DIR = process.env.BUILD_DIR || 'out';
/** Le chemin vers le dossier du code source, à partir de la racine du projet. */
const SOURCE_DIR = process.env.SOURCE_DIR || 'source';

/** Le chemin vers le dossier des événements, à partir du dossier du code source. */
const EVENTS_FOLDER = process.env.EVENTS_FOLDER || 'events';
/** Le chemin vers le dossier des commandes, à partir du dossier du code source. */
const COMMANDS_FOLDER = process.env.COMMANDS_FOLDER || 'commands';
/** Le chemin vers le dossier des composants, à partir du dossier du code source. */
const COMPONENTS_FOLDER = process.env.COMPONENTS_FOLDER || 'components';
/** Le chemin vers le dossier des autocomplétions, à partir du dossier du code source. */
const AUTOCOMPLETE_FOLDER = process.env.AUTOCOMPLETE_FOLDER || 'autocomplete';

/**
 * Charger les événements du bot.
 * @param client Le client Discord.js.
 */
export async function loadEvents(client: Discord.Client): Promise<void> {
    logging.info(' Loading events '.bgBlue.white);
    // Récupérer les fichiers du dossier "event"
    let files = fs.readdirSync(`${BUILD_DIR}/${EVENTS_FOLDER}`, {
        withFileTypes: true
    });

    // Parcourir chaque fichier
    await asyncForEach(files, async (file) => {
        // Vérifier que le fichier est un fichier javascript
        // (ex. ignorer les fichiers map)
        if (!file.name.endsWith('.js')) return;

        // Vérifier que le fichier est un fichier javascript
        // (ex. ignorer les fichiers map)
        if (!file.name.endsWith('.js')) return;

        // Vérifier que le fichier existe dans le dossier source,
        // sinon le supprimer du dossier build
        if (
            !fs.existsSync(
                `${SOURCE_DIR}/${EVENTS_FOLDER}/${file.name.replace(
                    /\.js$/,
                    '.ts'
                )}`
            )
        ) {
            fs.rmSync(`${BUILD_DIR}/${EVENTS_FOLDER}/${file.name}`);
            return;
        }

        // Ignorer les fichiers dont le nom commence par "__"
        if (file.name.startsWith('__')) return;

        // Lire le fichier
        let filedata = (await import(`../${EVENTS_FOLDER}/${file.name}`))
            .default as Bot.Event<keyof Discord.ClientEvents>;

        logging.log(`◉ ${filedata.name}`.blue);
        // Écouter l'événement
        client.on(filedata.name, (...args) => {
            logging.log(
                `[Event]       ${filedata.name.replace(/^./, (c) =>
                    c.toUpperCase()
                )}`,
                ...args
            );
            filedata.listener([...args], client);
        });
    });
}

/** Liste des commandes de type ChatInput */
export const ChatInputs = new Map<string, Bot.SlashCommand>();
/** Liste des commandes de type MessageAction */
export const MessageActions = new Map<string, Bot.MessageCommand>();
/** Liste des commandes de type UserAction */
export const UserActions = new Map<string, Bot.UserCommand>();

/** Liste de toutes les commandes */
export const AllCommands = [] as Discord.ApplicationCommand[];

/** Liste des commandes privées de type ChatInput */
export const PrivateChatInputs = new Map<string, Bot.SlashCommand>();
/** Liste des commandes privées de type MessageAction */
export const PrivateMessageActions = new Map<string, Bot.MessageCommand>();
/** Liste des commandes privées de type UserAction */
export const PrivateUserActions = new Map<string, Bot.UserCommand>();

/** Liste des commandes privées */
export const PrivateAllCommands = [] as Discord.ApplicationCommand[];

/**
 * Charger les commandes du bot.
 */
export async function loadCommands(): Promise<void> {
    logging.info(' Loading commands '.bgBlue.white);
    // Parcourir chaque type de commande
    for (const command_type of [
        'chat_input',
        'message_action',
        'user_action'
    ] as const) {
        // Passer au type suivant si `command_type` n'existe pas
        if (!fs.existsSync(`${BUILD_DIR}/${COMMANDS_FOLDER}/${command_type}`))
            continue;

        logging.log(`▽ ${command_type}`.green);

        /** Charger un dossier de scripts */
        async function loadDir(dir: string) {
            // Récupérer les fichiers de ce dossier
            let files = fs.readdirSync(
                `${BUILD_DIR}/${COMMANDS_FOLDER}/${dir}`,
                {
                    withFileTypes: true
                }
            );

            // Parcourir chaque fichier de ce dossier
            await asyncForEach(files, async (file) => {
                // Si c'est un dossier, charger les fichiers dans ce dossier et passer au fichier suivant
                if (file.isDirectory()) {
                    await loadDir(`${dir}/${file.name}`);
                    return;
                } else if (!file.isFile()) return;

                // Vérifier que le fichier est un fichier javascript
                // (ex. ignorer les fichiers map)
                if (!file.name.endsWith('.js')) return;

                // Vérifier que le fichier existe dans le dossier source,
                // sinon le supprimer du dossier build
                if (
                    !fs.existsSync(
                        `${SOURCE_DIR}/${COMMANDS_FOLDER}/${dir}/${file.name.replace(
                            /\.js$/,
                            '.ts'
                        )}`
                    )
                ) {
                    fs.rmSync(
                        `${BUILD_DIR}/${COMMANDS_FOLDER}/${dir}/${file.name}`
                    );
                    return;
                }

                // Ignorer les fichiers dont le nom commence par "__"
                if (file.name.startsWith('__')) return;

                // Lire le fichier
                let filedata = (
                    await import(`../${COMMANDS_FOLDER}/${dir}/${file.name}`)
                ).default as
                    | Bot.SlashCommand
                    | Bot.MessageCommand
                    | Bot.UserCommand;

                // Ajouter la commande dans la liste correspondante à son type
                switch (command_type) {
                    case 'chat_input':
                        filedata.command.type =
                            Discord.ApplicationCommandType.ChatInput;

                        if (file.name.startsWith('$'))
                            PrivateChatInputs.set(
                                filedata.command.name,
                                filedata as Bot.SlashCommand
                            );
                        else
                            ChatInputs.set(
                                filedata.command.name,
                                filedata as Bot.SlashCommand
                            );

                        break;
                    case 'message_action':
                        filedata.command.type =
                            Discord.ApplicationCommandType.Message;

                        if (file.name.startsWith('$'))
                            PrivateMessageActions.set(
                                filedata.command.name,
                                filedata as Bot.MessageCommand
                            );
                        else
                            MessageActions.set(
                                filedata.command.name,
                                filedata as Bot.MessageCommand
                            );

                        break;
                    case 'user_action':
                        filedata.command.type =
                            Discord.ApplicationCommandType.User;

                        if (file.name.startsWith('$'))
                            PrivateUserActions.set(
                                filedata.command.name,
                                filedata as Bot.UserCommand
                            );
                        else
                            UserActions.set(
                                filedata.command.name,
                                filedata as Bot.UserCommand
                            );

                        break;
                    default:
                        logging.log(`  ◈ ${filedata.command.name}`.red);
                        return;
                }
                logging.log(
                    `  ◈ ${filedata.command.name}`[
                        file.name.startsWith('$') ? 'gray' : 'blue'
                    ]
                );
            });
        }

        // Charger le dossier build/commands/`command_type`
        await loadDir(command_type);
    }

    // Ajouter toutes les commandes à la liste `AllCommands`
    [
        ...ChatInputs.values(),
        ...MessageActions.values(),
        ...UserActions.values()
    ].forEach((command) => {
        AllCommands.push(command.command as any);
    });

    // Ajouter toutes les commandes privées à la liste `PrivateAllCommands`
    [
        ...PrivateChatInputs.values(),
        ...PrivateMessageActions.values(),
        ...PrivateUserActions.values()
    ].forEach((command) => {
        PrivateAllCommands.push(command.command as any);
    });
}

/** Liste les composants de type Button */
export const Buttons = new Map<string, Bot.Button>();
/** Liste des composants de type Modal */
export const Modals = new Map<string, Bot.Modal>();
/** Liste des composants de type SelectMenu */
export const SelectMenus = new Map<string, Bot.AnySelectMenu>();

/** Liste de tous les composants */
export const AllComponents = [] as (
    | Bot.Button
    | Bot.Modal
    | Bot.AnySelectMenu
)['component'][];

/**
 * Charger les composants de message
 */
export async function loadComponents(): Promise<void> {
    logging.info(' Loading components '.bgBlue.white);
    // Parcourir chaque type de composant
    for (const component_type of ['button', 'modal', 'select_menu'] as const) {
        // Passer au type suivant si `component_type` n'existe pas
        if (
            !fs.existsSync(
                `${BUILD_DIR}/${COMPONENTS_FOLDER}/${component_type}`
            )
        )
            continue;
        logging.log(`▽ ${component_type}`.green);

        /** Charger un dossier de scripts */
        async function loadDir(dir: string) {
            // Lire le contenu du dossier `dir`
            let files = fs.readdirSync(
                `${BUILD_DIR}/${COMPONENTS_FOLDER}/${dir}`,
                {
                    withFileTypes: true
                }
            );

            // Parcourir chaque fichier du dossier `dir`
            await asyncForEach(files, async (file) => {
                // Si c'est un dossier, charger les fichiers dans ce dossier et passer au fichier suivant
                if (file.isDirectory()) {
                    await loadDir(`${dir}/${file.name}`);
                    return;
                } else if (!file.isFile()) return;

                // Vérifier que le fichier est un fichier javascript
                // (ex. ignorer les fichiers map)
                if (!file.name.endsWith('.js')) return;

                // Vérifier que le fichier existe dans le dossier source,
                // sinon le supprimer du dossier build
                if (
                    !fs.existsSync(
                        `${SOURCE_DIR}/${COMPONENTS_FOLDER}/${dir}/${file.name.replace(
                            /\.js$/,
                            '.ts'
                        )}`
                    )
                ) {
                    fs.rmSync(
                        `${BUILD_DIR}/${COMPONENTS_FOLDER}/${dir}/${file.name}`
                    );
                    return;
                }

                // Ignorer les fichiers dont le nom commence par "__"
                if (file.name.startsWith('__')) return;

                // Lire le fichier
                let filedata = (
                    await import(`../${COMPONENTS_FOLDER}/${dir}/${file.name}`)
                ).default as Bot.Button | Bot.Modal | Bot.AnySelectMenu;

                // Ajouter le composant dans la liste correspondante à son type
                switch (component_type) {
                    case 'button':
                        Buttons.set(
                            filedata.component.id,
                            filedata as Bot.Button
                        );
                        break;
                    case 'modal':
                        Modals.set(
                            filedata.component.id,
                            filedata as Bot.Modal
                        );
                        break;
                    case 'select_menu':
                        SelectMenus.set(
                            filedata.component.id,
                            filedata as Bot.AnySelectMenu
                        );
                        break;
                    default:
                        logging.log(`  ◈ ${filedata.component.id}`.red);
                        return;
                }
                logging.log(`  ◈ ${filedata.component.id}`.blue);
            });
        }

        // Charger le dossier build/components/`component_type`
        await loadDir(component_type);
    }

    // Ajouter tous les composants à la liste `AllComponents`
    [...Buttons.values(), ...Modals.values(), ...SelectMenus.values()].forEach(
        (component) => AllComponents.push(component.component)
    );
}

export const Autocompletes = new Map<string, Bot.Autocomplete>();

/**
 * Charger les autocomplétions de commande.
 */
export async function loadAutocompletes(): Promise<void> {
    logging.info(' Loading autocompletes '.bgBlue.white);
    // Vérifier que le dossier existe dans le dossier build
    if (!fs.existsSync(`${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/`))
        // Sinon terminer la fonction
        return;

    /** Charger un dossier de scripts */
    async function loadDir(dir: string) {
        // Lire le contenu du dossier `dir`
        fs.readdir(
            `${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}`,
            {
                withFileTypes: true
            },
            async (err, files) => {
                // Renvoyer une erreur si c'est impossible de lister les fichiers
                if (err) throw err;

                // Parcourir chaque fichier
                await asyncForEach(files, async (file) => {
                    // Si c'est un dossier, charger les fichiers dans ce dossier et terminer la fonction
                    if (file.isDirectory()) {
                        await loadDir(`${dir}/${file.name}`);
                        return;
                    } else if (!file.isFile()) return;

                    // Vérifier que le fichier est un fichier javascript
                    // (ex. ignorer les fichiers map)
                    if (!file.name.endsWith('.js')) return;

                    // Vérifier que le fichier existe dans le dossier source,
                    // sinon le supprimer du dossier build
                    if (
                        !fs.existsSync(
                            `${SOURCE_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}/${file.name.replace(
                                /\.js$/,
                                '.ts'
                            )}`
                        )
                    ) {
                        fs.rmSync(
                            `${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}/${file.name}`
                        );
                        return;
                    }

                    // Ignorer les fichiers dont le nom commence par "__"
                    if (file.name.startsWith('__')) return;

                    // Lire le fichier
                    let filedata = (
                        await import(
                            `../${AUTOCOMPLETE_FOLDER}/${dir}/${file.name}`
                        )
                    ).default as Bot.Autocomplete;

                    logging.log(`◉ ${filedata.name}`.blue);
                    // Ajouter le fichier et son contenu dans la liste des autocomplétitions
                    Autocompletes.set(
                        filedata.name,
                        filedata as Bot.Autocomplete
                    );
                });
            }
        );
    }

    // Charger le dossier build/commands
    await loadDir('');
}

/**
 * Démmarer le bot.
 */
export async function init(client: Discord.Client) {
    client.login(process.env.BOT_TOKEN);
}
