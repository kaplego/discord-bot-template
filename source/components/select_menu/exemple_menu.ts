import { ComponentType, UserSelectMenuInteraction } from 'discord.js';
import { PSelectMenuInteraction } from '../../types';

export default {
    component: {
        id: 'select_menu'
    },
    execute(interaction, client) {
        interaction.reply(interaction.values.join(', '));
    }
} as PSelectMenuInteraction<
    ComponentType.UserSelect,
    UserSelectMenuInteraction
>;
