import type { Bot } from '../../types';

export default {
    component: {
        id: 'select_menu'
    },
    execute(interaction) {
        // Renvoyer les valeurs sélectionnées
        interaction.reply({
            content: interaction.values.join(', '),
            ephemeral: true
        });
    }
} as Bot.StringSelectMenu;
