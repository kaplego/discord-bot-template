import type { Bot } from '../../types';
import { BUILD_DIR, COMMANDS_FOLDER, SOURCE_DIR } from '.';
import { Discord, DiscordTypes, asyncForEach, fs } from '..';
import { logging } from '../..';

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
            const files = fs.readdirSync(
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
                const filedata = (
                    await import(`../../${COMMANDS_FOLDER}/${dir}/${file.name}`)
                ).default as
                    | Bot.SlashCommand
                    | Bot.MessageCommand
                    | Bot.UserCommand;

                // Ajouter la commande dans la liste correspondante à son type
                switch (command_type) {
                    case 'chat_input':
                        const cData = {
                            ...(filedata as Bot.SlashCommand),
                            command: {
                                ...filedata.command,
                                type: DiscordTypes.ApplicationCommandType
                                    .ChatInput
                            } as Discord.ChatInputApplicationCommandData
                        };

                        if (file.name.startsWith('$'))
                            PrivateChatInputs.set(filedata.command.name, cData);
                        else ChatInputs.set(filedata.command.name, cData);

                        break;
                    case 'message_action':
                        const mData = {
                            ...(filedata as Bot.MessageCommand),
                            command: {
                                ...filedata.command,
                                type: DiscordTypes.ApplicationCommandType
                                    .Message
                            } as Discord.MessageApplicationCommandData
                        };

                        if (file.name.startsWith('$'))
                            PrivateMessageActions.set(
                                filedata.command.name,
                                mData
                            );
                        else MessageActions.set(filedata.command.name, mData);

                        break;
                    case 'user_action':
                        const uData = {
                            ...(filedata as Bot.UserCommand),
                            command: {
                                ...filedata.command,
                                type: DiscordTypes.ApplicationCommandType.User
                            } as Discord.UserApplicationCommandData
                        };
                        
                        if (file.name.startsWith('$'))
                            PrivateUserActions.set(
                                filedata.command.name,
                                uData
                            );
                        else UserActions.set(filedata.command.name, uData);

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
        AllCommands.push(command.command as Discord.ApplicationCommand);
    });

    // Ajouter toutes les commandes privées à la liste `PrivateAllCommands`
    [
        ...PrivateChatInputs.values(),
        ...PrivateMessageActions.values(),
        ...PrivateUserActions.values()
    ].forEach((command) => {
        PrivateAllCommands.push(command.command as Discord.ApplicationCommand);
    });
}
