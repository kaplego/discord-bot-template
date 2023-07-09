import { PEvent } from '../types';
import { AllCommands } from '../utils/loaders';
import { Discord } from '../utils/utils';

export default {
    name: 'ready',
    async listener([client]) {
        // Charger toutes les commandes sur Discord
        client.application.commands.set(AllCommands as Discord.ApplicationCommandDataResolvable[]);
        console.log(' ==== READY ==== '.bgGreen.white);
    }
} as PEvent<'ready'>;
