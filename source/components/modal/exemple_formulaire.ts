import { PModalInteraction } from '../../types';

export default {
    component: {
        id: 'formulaire'
    },
    execute(interaction, client, checkPerms, checkChannelPerms) {
        interaction.reply(interaction.fields.getTextInputValue('input'));
    }
} as PModalInteraction;
