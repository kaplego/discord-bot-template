import { PModalInteraction } from '../../types';

export default {
    component: {
        id: 'formulaire'
    },
    execute(interaction, client) {
        interaction.reply(interaction.fields.getTextInputValue('input'));
    }
} as PModalInteraction;
