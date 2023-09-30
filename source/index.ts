import Discord, { Locale, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { asyncForEach, fs, throwError } from './utils/utils';
import {
    init,
    loadAutocompletes,
    loadCommands,
    loadComponents,
    loadEvents
} from './utils/loaders';
import Logging from './utils/logs';
import { LocalesManager } from './utils/localization';

// Charger les variables de configuration
dotenv.config();

const client = new Discord.Client({
    intents: [],
    partials: [Partials.Channel, Partials.GuildMember]
});

export const logging = new Logging();
export const locales = new LocalesManager(Locale.EnglishGB);

(async () => {
    let error = false;

    // Charger les traductions
    await locales.load().catch((err) => {
        throwError(err);
        error = true;
    });

    // Charger les événements
    await loadEvents(client).catch((err) => {
        throwError(err);
        error = true;
    });

    // Charger les commandes
    await loadCommands().catch((err) => {
        throwError(err);
        error = true;
    });

    // Charger les composants
    await loadComponents().catch((err) => {
        throwError(err);
        error = true;
    });

    // Charger les autocomplétitions
    await loadAutocompletes().catch((err) => {
        throwError(err);
        error = true;
    });

    if (error) return;

    // Démarrer le bot
    await init(client);
})();
