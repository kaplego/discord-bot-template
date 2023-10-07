import type { Bot } from '../types';
import type { Discord } from '../utils/utils';
import { logging } from '..';
import { AllCommands, PrivateAllCommands } from '../utils/loaders';

export default {
    name: 'ready',
    async listener([client]) {
        // Charger toutes les commandes sur Discord
        logging.info(' Updating commands '.bgMagenta.white);
        client.application.commands.set(
            AllCommands as Discord.ApplicationCommandDataResolvable[]
        );
        // Charger toutes les commandes privées sur Discord
        if (process.env.PRIVATE_SERVER_ID && PrivateAllCommands.length > 0) {
            logging.info(' Updating private commands '.bgMagenta.white);
            client.guilds
                .resolve(process.env.PRIVATE_SERVER_ID)
                ?.commands.set(
                    PrivateAllCommands as Discord.ApplicationCommandDataResolvable[]
                );
        }

        logging.info(' ==== READY ==== '.bgGreen.white);
    }
} as Bot.Event<'ready'>;
