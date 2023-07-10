import { EmbedBuilder, GuildMember } from 'discord.js';
import { PCommandUserAction } from '../../types';

export default {
    command: {
        name: 'Infos utilisateur'
    },
    execute(interaction, client) {
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
                        `A rejoint le server <t:${member.joinedTimestamp.toString().slice(0, -3)}:R>`
                    )
            ]
        });
    }
} as PCommandUserAction;
