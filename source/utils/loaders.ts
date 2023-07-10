import fs from 'fs';
import Discord, { ApplicationCommand } from 'discord.js';
import {
    PAnySelectMenuInteraction,
    PAutocomplete,
    PButtonInteraction,
    PCommandChatInput,
    PCommandMessageAction,
    PCommandUserAction,
    PEvent,
    PModalInteraction
} from '../types';
import {
    asyncForEach,
} from './utils';
import config from './config';
import {
    AUTOCOMPLETE_FOLDER,
    BUILD_DIR,
    COMMANDS_FOLDER,
    COMPONENTS_FOLDER,
    EVENTS_FOLDER,
    SOURCE_DIR
} from './consts';

export async function loadEvents(client: Discord.Client): Promise<void> {
    console.log(' Loading events '.bgBlue.white);
    // Récupérer les fichiers du dossier "event"
    let files = fs.readdirSync(`${BUILD_DIR}/${EVENTS_FOLDER}`, {
        withFileTypes: true
    });

    // Parcourir chaque fichier
    await asyncForEach(files, (file) => {
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
        import(`../${EVENTS_FOLDER}/${file.name}`)
            .then(
                ({
                    default: filedata
                }: {
                    default: PEvent<keyof Discord.ClientEvents>;
                }) => {
                    // Écouter l'événement
                    client.on(filedata.name, (...args) =>
                        filedata.listener(
                            [...args],
                            client
                        )
                    );
                    console.log(`◉ ${filedata.name}`.blue);
                }
            )
            .catch((err) => {
                throw err;
            });
    });
}

/** Liste des commandes de type ChatInput */
export const ChatInputs = new Map<string, PCommandChatInput>();
/** Liste des commandes de type MessageAction */
export const MessageActions = new Map<string, PCommandMessageAction>();
/** Liste des commandes de type UserAction */
export const UserActions = new Map<string, PCommandUserAction>();

/** Liste de toutes les commandes */
export const AllCommands = [] as ApplicationCommand[];

export async function loadCommands(): Promise<void> {
    console.log(' Loading commands '.bgBlue.white);
    // Parcourir chaque type de commande
    for (const command_type of [
        'chat_input',
        'message_action',
        'user_action'
    ] as const) {
        // Passer au type suivant si `command_type` n'existe pas
        if (!fs.existsSync(`${BUILD_DIR}/${COMMANDS_FOLDER}/${command_type}`))
            continue;

        console.log(`▽ ${command_type}`.cyan);

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
                import(`../${COMMANDS_FOLDER}/${dir}/${file.name}`)
                    .catch((err) => {
                        throw err;
                    })
                    .then(
                        ({
                            default: filedata
                        }: {
                            default:
                                | PCommandChatInput
                                | PCommandMessageAction
                                | PCommandUserAction;
                        }) => {
                            // Ajouter la commande dans la liste correspondante à son type
                            switch (command_type) {
                                case 'chat_input':
                                    ChatInputs.set(
                                        filedata.command.name,
                                        filedata as PCommandChatInput
                                    );
                                    console.log(
                                        `  ◈ ${filedata.command.name}`.blue
                                    );
                                    break;
                                case 'message_action':
                                    MessageActions.set(
                                        filedata.command.name,
                                        filedata as PCommandMessageAction
                                    );
                                    console.log(
                                        `  ◈ ${filedata.command.name}`.blue
                                    );
                                    break;
                                case 'user_action':
                                    UserActions.set(
                                        filedata.command.name,
                                        filedata as PCommandUserAction
                                    );
                                    console.log(
                                        `  ◈ ${filedata.command.name}`.blue
                                    );
                                    break;
                                default:
                                    console.log(
                                        `  ◈ ${filedata.command.name}`.red
                                    );
                            }
                        }
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
}

/** Liste les composants de type Button */
export const Buttons = new Map<string, PButtonInteraction>();
/** Liste des composants de type Modal */
export const Modals = new Map<string, PModalInteraction>();
/** Liste des composants de type SelectMenu */
export const SelectMenus = new Map<string, PAnySelectMenuInteraction>();

/** Liste de tous les composants */
export const AllComponents = [] as (
    | PButtonInteraction
    | PModalInteraction
    | PAnySelectMenuInteraction
)['component'][];

/** Charger les composants de message */
export async function loadComponents(): Promise<void> {
    console.log(' Loading components '.bgBlue.white);
    // Parcourir chaque type de composant
    for (const component_type of ['button', 'modal', 'select_menu'] as const) {
        // Passer au type suivant si `component_type` n'existe pas
        if (
            !fs.existsSync(
                `${BUILD_DIR}/${COMPONENTS_FOLDER}/${component_type}`
            )
        )
            continue;
        console.log(`▽ ${component_type}`.cyan);

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
                let filedata = (await import(
                    `../${COMPONENTS_FOLDER}/${dir}/${file.name}`
                )) as
                    | PButtonInteraction
                    | PModalInteraction
                    | PAnySelectMenuInteraction;
                console.log(`  ◈ ${filedata.component.id}`.blue);
                // Ajouter le composant dans la liste correspondante à son type
                switch (component_type) {
                    case 'button':
                        Buttons.set(
                            filedata.component.id,
                            filedata as PButtonInteraction
                        );
                        break;
                    case 'modal':
                        Modals.set(
                            filedata.component.id,
                            filedata as PModalInteraction
                        );
                        break;
                    case 'select_menu':
                        SelectMenus.set(
                            filedata.component.id,
                            filedata as PAnySelectMenuInteraction
                        );
                        break;
                }
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

export const Autocompletes = new Map<string, PAutocomplete>();

/** Charger les autocomplétitions */
export function loadAutocompletes(): Promise<void> {
    console.log(' Loading autocompletes '.bgBlue.white);
    // Renvoyer une instance Promise
    return new Promise<void>(
        async (/** Terminer sans erreur */ r, /** Renvoyer une erreur */ e) => {
            // Vérifier que le dossier existe dans le dossier build
            if (!fs.existsSync(`${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/`))
                // Sinon terminer la fonction
                return r();

            /** Charger un dossier de scripts */
            async function loadDir(dir: string) {
                // Renvoyer une instance Promise
                return new Promise<void>((/** Terminer sans erreur */ r2) => {
                    // Lire le contenu du dossier `dir`
                    fs.readdir(
                        `${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}`,
                        {
                            withFileTypes: true
                        },
                        async (err, files) => {
                            // Renvoyer une erreur si c'est impossible de lister les fichiers
                            if (err) return e(err);

                            // Parcourir chaque fichier
                            await asyncForEach(files, async (file) => {
                                // Si c'est un dossier, charger les fichiers dans ce dossier et terminer la fonction
                                if (file.isDirectory()) {
                                    await loadDir(`${dir}/${file.name}`);
                                    return r2();
                                } else if (!file.isFile()) return r2();

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
                                    return r2();
                                }

                                // Ignorer les fichiers dont le nom commence par "__"
                                if (file.name.startsWith('__')) return;

                                // Lire le fichier
                                import(
                                    `../${AUTOCOMPLETE_FOLDER}/${dir}/${file.name}`
                                )
                                    .then(
                                        ({
                                            default: filedata
                                        }: {
                                            default: PAutocomplete;
                                        }) => {
                                            console.log(
                                                `◉ ${filedata.name}`.blue
                                            );
                                            // Ajouter le fichier et son contenu dans la liste des autocomplétitions
                                            Autocompletes.set(
                                                filedata.name,
                                                filedata as PAutocomplete
                                            );
                                            r2();
                                        }
                                    )
                                    .catch(e);
                            });
                        }
                    );
                });
            }

            // Charger le dossier build/commands
            await loadDir('');

            // Terminer la fonction sans erreurs
            r();
        }
    );
}

/** Démarrer le bot */
export async function init(client: Discord.Client) {
    client.login(config.application.token);
}
