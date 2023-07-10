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
