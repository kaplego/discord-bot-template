import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';
import { PCommandChatInput } from '../../types';

export default {
    command: {
        name: 'exemple',
        description: 'Une commande slash classique.',
        descriptionLocalizations: {
            'en-GB': 'A classic slash command.'
        },
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'autocomplete',
                description: 'Une option avec autocomplétition.',
                autocomplete: true
            }
        ]
    },
    execute(interaction, client) {
        interaction.reply({
            // Renvoyer un embed
            embeds: [
                new EmbedBuilder()
                    .setTitle('Voilà')
                    .setDescription('Un exemple de commande slash.')
            ],
            // Avec un bouton
            components: [
                // Action Row contenant des boutons
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                    // Ajouter un bouton
                    new ButtonBuilder()
                        // Définir l'identifiant unique
                        .setCustomId(`bouton_${Math.floor(Math.random() * 10)}`)
                        // Définir le type de bouton (primary, secondary, success, danger, link)
                        .setStyle(ButtonStyle.Primary)
                        // Définir le text affiché sur le bouton
                        .setLabel('Ouvrir un formulaire')
                )
            ]
        });
    }
} as PCommandChatInput;
