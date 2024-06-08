import type { Bot } from '../../types';
import { Discord } from '../../utils';

export default {
    command: {
        name: 'Infos message'
    },
    execute(interaction) {
        interaction.reply({
            // Renvoyer un embed avec comme info si le message est épinglé
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle('Le message sélectionné')
                    .setDescription(
                        `${
                            interaction.targetMessage.pinned
                                ? 'Est'
                                : "N'est pas"
                        } épinglé`
                    )
            ],
            // Avec un menu de sélection d'utilisateurs
            components: [
                new Discord.ActionRowBuilder<Discord.UserSelectMenuBuilder>().setComponents(
                    new Discord.UserSelectMenuBuilder()
                        .setCustomId('select_menu')
                        .setPlaceholder('Un menu de sélection')
                )
            ]
        });
    }
} as Bot.MessageCommand;
