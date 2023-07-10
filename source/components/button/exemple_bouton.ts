import { ModalBuilder, TextInputStyle } from 'discord.js';
import { PButtonInteraction } from '../../types';
import { ActionRowBuilder, TextInputBuilder } from '@discordjs/builders';

export default {
    component: {
        id: 'bouton',
        regex: /^bouton_[0-9]$/
    },
    execute(interaction, client) {
        interaction.showModal(
            new ModalBuilder()
                .setCustomId('formulaire')
                .setTitle('Un formulaire')
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>().setComponents(
                        new TextInputBuilder()
                            .setCustomId('input')
                            .setStyle(TextInputStyle.Paragraph)
                            .setLabel('Un champ de texte')
                            .setPlaceholder('Un placeholder')
                            .setRequired(true)
                            .setValue(interaction.customId.slice(7))
                    )
                )
        );
    }
} as PButtonInteraction;
