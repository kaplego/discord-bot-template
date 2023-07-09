import { EmbedBuilder, GuildMember } from 'discord.js';
import { PCommandMessageAction, PCommandUserAction } from '../../types';

export default {
    command: {
        name: 'Infos utilisateur'
    },
    execute(interaction, client, checkPerms, checkChannelPerms) {
        const member = interaction.targetMember as GuildMember;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(
                        `${
                            member.displayName ??
                            interaction.targetUser.username
                        }`
                    )
                    .setDescription(
                        `A rejoint le server <t:${member.joinedTimestamp}:R>`
                    )
            ]
        });
    }
} as PCommandUserAction;
