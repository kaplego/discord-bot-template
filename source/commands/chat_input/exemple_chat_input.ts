import type { Bot } from '../../types';
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';
import { locales } from '../..';

const commandLocales = locales.command('slash', 'exemple');

export default {
    command: {
        name: 'exemple',
        description: 'Une commande slash classique.',
        descriptionLocalizations: commandLocales.get('description'),
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'autocomplete',
                nameLocalizations: commandLocales
                    .option('autocomplete')
                    .get('name'),
                description: 'Une option avec autocomplétition.',
                descriptionLocalizations: commandLocales
                    .option('autocomplete')
                    .get('description'),
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
} as Bot.SlashCommand;
