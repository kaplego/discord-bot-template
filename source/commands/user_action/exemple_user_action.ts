import type { Bot } from '../../types';
import { Discord } from '../../utils';

export default {
    command: {
        name: 'Infos utilisateur'
    },
    execute(interaction) {
        const member = interaction.targetMember as Discord.GuildMember;

        interaction.reply({
            // Renvoyer un embed
            embeds: [
                new Discord.EmbedBuilder()
                    // Avec comme titre le pseudo de l'utilisateur visé
                    .setTitle(
                        `${
                            member.displayName ??
                            interaction.targetUser.username
                        }`
                    )
                    // Avec comme description quand l'utilisateur a rejoint le serveur
                    .setDescription(
                        `A rejoint le server <t:${member.joinedTimestamp
                            .toString()
                            .slice(0, -3)}:R>`
                    )
            ]
        });
    }
} as Bot.UserCommand;
