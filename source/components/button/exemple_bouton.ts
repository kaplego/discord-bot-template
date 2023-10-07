import type { Bot } from '../../types';
import { ModalBuilder, TextInputStyle } from 'discord.js';
import { ActionRowBuilder, TextInputBuilder } from '@discordjs/builders';

export default {
    component: {
        id: 'bouton',
        regex: /^bouton_[0-9]$/
    },
    execute(interaction, client) {
        // Afficher un formulaire
        interaction.showModal(
            new ModalBuilder()
                // Définir l'identifiant unique
                .setCustomId('formulaire')
                // Définir le titre affiché
                .setTitle('Un formulaire')
                // Ajouter les champs de texte
                .setComponents(
                    // Action Row contenant un champ de texte
                    new ActionRowBuilder<TextInputBuilder>().setComponents(
                        // Ajouter le champ de texte
                        new TextInputBuilder()
                            // Définir l'identifiant unique
                            .setCustomId('input')
                            // Définir le type de champ (court ou paragraphe)
                            .setStyle(TextInputStyle.Short)
                            // Définir le label affiché
                            .setLabel('Un champ de texte')
                            // Définir le placeholder affiché quand le champ est vide
                            .setPlaceholder('Un placeholder')
                            // Définir le champ comme requis
                            .setRequired(true)
                            // Définir la valeur par défaut
                            .setValue(interaction.customId.slice(7))
                    )
                )
        );
    }
} as Bot.Button;
