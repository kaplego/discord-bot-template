import { logging } from '..';
import { PEvent } from '../types';
import { AllCommands, PrivateAllCommands } from '../utils/loaders';
import { Discord } from '../utils/utils';

export default {
    name: 'ready',
    async listener([client]) {
        // Charger toutes les commandes sur Discord
        logging.log(' Updating commands '.bgMagenta.white);
        client.application.commands.set(
            AllCommands as Discord.ApplicationCommandDataResolvable[]
        );
        // Charger toutes les commandes privées sur Discord
        if (process.env.PRIVATE_SERVER_ID && PrivateAllCommands.length > 0) {
            logging.log(' Updating private commands '.bgMagenta.white);
            client.guilds
                .resolve(process.env.PRIVATE_SERVER_ID)
                ?.commands.set(
                    PrivateAllCommands as Discord.ApplicationCommandDataResolvable[]
                );
        }

        logging.log(' ==== READY ==== '.bgGreen.white);
    }
} as PEvent<'ready'>;
