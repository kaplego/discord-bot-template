import Discord from 'discord.js';
import config from './utils/config';
import { throwError } from './utils/utils';
import {
    init,
    loadAutocompletes,
    loadCommands,
    loadComponents,
    loadEvents
} from './utils/loaders';

const client = new Discord.Client(config.bot.options);

(async () => {
    // Charger les événements
    await loadEvents(client).catch((err) => {
        throw throwError(err);
    });

    // Charger les commandes
    await loadCommands().catch((err) => {
        throw throwError(err);
    });

    // Charger les composants
    await loadComponents().catch((err) => {
        throw throwError(err);
    });

    // Charger les autocomplétitions
    await loadAutocompletes().catch((err) => {
        throw throwError(err);
    });

    // Démarrer le bot
    await init(client);
})();
