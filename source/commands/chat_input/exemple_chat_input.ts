import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { PCommandChatInput } from "../../types";

export default {
    command: {
        name: 'exemple',
        description: 'Une commande slash classique.',
        descriptionLocalizations: {
            "en-GB": "A classic slash command."
        },
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: 'utilisateur',
                description: 'Une option pour sélectionner un utilisateur.'
            }
        ]
    },
    execute(interaction, client, checkPerms, checkChannelPerms) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Voilà')
                    .setDescription('Un exemple de commande slash.')
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .setComponents(
                        new ButtonBuilder()
                            .setCustomId(`bouton_${Math.floor(Math.random() * 10)}`)
                            .setStyle(ButtonStyle.Primary)
                            .setLabel('Ouvrir un formulaire')
                    )
            ]
        })
    },
} as PCommandChatInput;