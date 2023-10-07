import Discord, { Locale, Partials } from 'discord.js';
import dotenv from 'dotenv';
import {
    init,
    loadAutocompletes,
    loadCommands,
    loadComponents,
    loadEvents
} from './utils/loaders';
import LogManager from './utils/logs';
import { LocalesManager } from './utils/localization';
import webLogs from './modules/weblogs/weblogs';
import Convert from 'ansi-to-html';

export const convert = new Convert({
    colors: {
        0: '#000000',
        1: '#da4232',
        2: '#56b97f',
        4: '#3b70c2',
        5: '#ae48b6',
        7: '#ffffff'
    }
});

// Charger les variables de configuration
dotenv.config();

const client = new Discord.Client({
    intents: [],
    partials: [Partials.Channel, Partials.GuildMember]
});

/**
 * Le gestionnaire de logs.
 */
export const logging = new LogManager();
export const locales = new LocalesManager(Locale.EnglishGB);

(async () => {
    let error = false;

    // Charger les traductions
    await locales.load().catch((err) => {
        logging.critical(err);
        error = true;
    });

    // Charger les événements
    await loadEvents(client).catch((err) => {
        logging.critical(err);
        error = true;
    });

    // Charger les commandes
    await loadCommands().catch((err) => {
        logging.critical(err);
        error = true;
    });

    // Charger les composants
    await loadComponents().catch((err) => {
        logging.critical(err);
        error = true;
    });

    // Charger les autocomplétitions
    await loadAutocompletes().catch((err) => {
        logging.critical(err);
        error = true;
    });

    // Créer le serveur weblogs
    webLogs(logging);

    if (error) throw new Error('An error occured while loading the bot.');

    // Démarrer le bot
    await init(client);
})();
