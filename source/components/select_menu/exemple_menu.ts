import {
    ComponentType,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction
} from 'discord.js';
import {
    PButtonInteraction,
    PModalInteraction,
    PSelectMenuInteraction
} from '../../types';

export default {
    component: {
        id: 'select_menu'
    },
    execute(interaction, client, checkPerms, checkChannelPerms) {
        interaction.reply(interaction.values.join(', '));
    }
} as PSelectMenuInteraction<
    ComponentType.UserSelect,
    UserSelectMenuInteraction
>;
