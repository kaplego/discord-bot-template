import {
    init,
    loadAutocompletes,
    loadCommands,
    loadComponents,
    loadEvents,
    loadModules
} from './utils/loaders';
import { LocalesManager } from './utils/localization';
import LogManager from './utils/logs';
import { Discord, DiscordTypes } from './utils';
import dotenv from 'dotenv';


// Charger les variables de configuration
dotenv.config();

const client = new Discord.Client({
    intents: [],
    partials: [Discord.Partials.Channel, Discord.Partials.GuildMember]
});

/**
 * Le gestionnaire de logs.
 */
export const logging = new LogManager();
export const locales = new LocalesManager(DiscordTypes.Locale.EnglishGB);

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

    await loadModules().catch((err) => {
        logging.critical(err);
        error = true;
    });

    if (error) throw new Error('An error occured while loading the bot.');

    // Démarrer le bot
    await init(client);
})();
