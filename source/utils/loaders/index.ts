import type { Discord } from '..';

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
/** Le chemin vers le dossier des modules, à partir du dossier du code source */
const MODULES_FOLDER = process.env.MODULES_FOLDER || 'modules';

export {
    BUILD_DIR,
    SOURCE_DIR,
    EVENTS_FOLDER,
    COMMANDS_FOLDER,
    COMPONENTS_FOLDER,
    AUTOCOMPLETE_FOLDER,
    MODULES_FOLDER
};

export * from './events';
export * from './commands';
export * from './components';
export * from './autocompletes';
export * from './modules';

/**
 * Démmarer le bot.
 */
export async function init(client: Discord.Client) {
    client.login(process.env.BOT_TOKEN);
}
