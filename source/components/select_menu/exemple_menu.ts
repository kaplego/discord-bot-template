import { ComponentType, UserSelectMenuInteraction } from 'discord.js';
import { PSelectMenuInteraction } from '../../types';

export default {
    component: {
        id: 'select_menu'
    },
    execute(interaction, client) {
        // Renvoyer les valeurs sélectionnées
        interaction.reply({
            content: interaction.values.join(', '),
            ephemeral: true
        });
    }
} as PSelectMenuInteraction<
    ComponentType.UserSelect,
    UserSelectMenuInteraction
>;
