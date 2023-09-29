import { PEvent } from '../types';
import { AllCommands, PrivateAllCommands } from '../utils/loaders';
import { Discord } from '../utils/utils';
import { PRIVATE_SERVER_ID } from '../utils/consts';

export default {
    name: 'ready',
    async listener([client]) {
        // Charger toutes les commandes sur Discord
        console.log(' Updating commands '.bgMagenta.white);
        client.application.commands.set(
            AllCommands as Discord.ApplicationCommandDataResolvable[]
        );
        console.log(' Updating private commands '.bgMagenta.white);
        client.guilds
            .resolve(PRIVATE_SERVER_ID)
            ?.commands.set(
                PrivateAllCommands as Discord.ApplicationCommandDataResolvable[]
            );
        console.log(' ==== READY ==== '.bgGreen.white);
    }
} as PEvent<'ready'>;
