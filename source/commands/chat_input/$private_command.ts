import type { Bot } from '../../types';
import { DiscordTypes } from '../../utils';
import { locales } from '../..';

const commandLocales = locales.command('slash', 'private');

export default {
    command: {
        name: commandLocales.getOne('name'),
        nameLocalizations: commandLocales.get('name'),
        description: commandLocales.getOne('description'),
        descriptionLocalizations: commandLocales.get('description'),
        options: [
            {
                type: DiscordTypes.ApplicationCommandOptionType.String,
                name: commandLocales.option('option').getOne('name'),
                nameLocalizations: commandLocales.option('option').get('name'),
                description: commandLocales
                    .option('option')
                    .getOne('description'),
                descriptionLocalizations: commandLocales
                    .option('option')
                    .get('description'),
                required: true,
                choices: [
                    {
                        name: commandLocales
                            .option('option')
                            .choice('choice_1')
                            .getOne('name'),
                        nameLocalizations: commandLocales
                            .option('option')
                            .choice('choice_1')
                            .get('name'),
                        value: 'choice_1'
                    },
                    {
                        name: commandLocales
                            .option('option')
                            .choice('choice_2')
                            .getOne('name'),
                        nameLocalizations: commandLocales
                            .option('option')
                            .choice('choice_2')
                            .get('name'),
                        value: 'choice_2'
                    }
                ]
            }
        ]
    },
    async execute(interaction, client) {
        // Répondre à l'interaction avec un message traduit dans la langue de l'utilisateur (si disponible, sinon la langue par défaut)
        interaction.reply({
            content: commandLocales.getOne(
                'commandData.reply',
                interaction.locale
            ),
            ephemeral: true
        });
    }
} as Bot.SlashCommand;
