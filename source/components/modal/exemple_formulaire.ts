import type { Bot } from '../../types';

export default {
    component: {
        id: 'formulaire'
    },
    execute(interaction, client) {
        // Renvoyer le contenu du champ de texte avec comme identifiant `input`
        interaction.reply({
            content: interaction.fields.getTextInputValue('input'),
            ephemeral: true
        });
    }
} as Bot.Modal;
