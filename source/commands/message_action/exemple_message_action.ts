import {
    ActionRowBuilder,
    EmbedBuilder,
    UserSelectMenuBuilder
} from 'discord.js';
import { PCommandMessageAction } from '../../types';

export default {
    command: {
        name: 'Infos message'
    },
    execute(interaction, client) {
        interaction.reply({
            // Renvoyer un embed avec comme info si le message est épinglé
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Le message sélectionné`)
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
                new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId('select_menu')
                        .setPlaceholder('Un menu de sélection')
                )
            ]
        });
    }
} as PCommandMessageAction;
