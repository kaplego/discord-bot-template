import { PModalInteraction } from '../../types';

export default {
    component: {
        id: 'formulaire'
    },
    execute(interaction, client) {
        interaction.reply({
            content: interaction.fields.getTextInputValue('input'),
            ephemeral: true
        });
    }
} as PModalInteraction;
