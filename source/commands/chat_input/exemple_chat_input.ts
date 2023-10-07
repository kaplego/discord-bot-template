import { Discord, type Bot } from '../../types';
import { locales } from '../..';

const commandLocales = locales.command('slash', 'exemple');

export default {
    command: {
        name: 'exemple',
        description: 'Une commande slash classique.',
        descriptionLocalizations: commandLocales.get('description'),
        options: [
            {
                type: Discord.ApplicationCommandOptionType.String,
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
                new Discord.EmbedBuilder()
                    .setTitle('Voilà')
                    .setDescription('Un exemple de commande slash.')
            ],
            // Avec un bouton
            components: [
                // Action Row contenant des boutons
                new Discord.ActionRowBuilder<Discord.ButtonBuilder>().setComponents(
                    // Ajouter un bouton
                    new Discord.ButtonBuilder()
                        // Définir l'identifiant unique
                        .setCustomId(`bouton_${Math.floor(Math.random() * 10)}`)
                        // Définir le type de bouton (primary, secondary, success, danger, link)
                        .setStyle(Discord.ButtonStyle.Primary)
                        // Définir le text affiché sur le bouton
                        .setLabel('Ouvrir un formulaire')
                )
            ]
        });
    }
} as Bot.SlashCommand;
