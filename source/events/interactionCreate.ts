import { AnySelectMenuInteraction } from 'discord.js';
import { PEvent } from '../types';
import {
    Autocompletes,
    Buttons,
    ChatInputs,
    MessageActions,
    Modals,
    SelectMenus,
    UserActions
} from '../utils/loaders';

export default {
    name: 'interactionCreate',
    listener([interaction], client, checkPerms, checkChannelPerms) {
        // Si l'interaction est une commande
        if (interaction.isCommand()) {
            // Si la commande est une commande de tchat
            if (
                interaction.isChatInputCommand() &&
                ChatInputs.has(interaction.commandName)
            )
                ChatInputs.get(interaction.commandName).execute(
                    interaction,
                    client,
                    checkPerms,
                    checkChannelPerms
                );
            // Si la commande est un menu contextuel de message
            else if (
                interaction.isMessageContextMenuCommand() &&
                MessageActions.get(interaction.commandName)
            )
                MessageActions.get(interaction.commandName).execute(
                    interaction,
                    client,
                    checkPerms,
                    checkChannelPerms
                );
            // Si la commande est un menu contextuel d'utilisateur
            else if (
                interaction.isUserContextMenuCommand() &&
                UserActions.get(interaction.commandName)
            )
                UserActions.get(interaction.commandName).execute(
                    interaction,
                    client,
                    checkPerms,
                    checkChannelPerms
                );
            else {
                interaction.reply({
                    content: 'Unknown interaction.'
                });
            }

            // Si l'interaction provient d'un composant
        } else if (
            interaction.isMessageComponent() ||
            interaction.isModalSubmit()
        ) {
            // Si le composant est un bouton
            if (interaction.isButton()) {
                // Parcourir chaque bouton enregistré
                for (const [name, button] of Buttons.entries()) {
                    if (
                        // Si le bouton n'accepte pas les Regex
                        // et que l'id de l'interaction correspond à l'id du bouton
                        (!button.component.regex &&
                            button.component.id === interaction.customId) ||
                        // Ou si le bouton accepte les Regex
                        // et que l'id de l'interaction correspond au Regex du bouton
                        (button.component.regex instanceof RegExp &&
                            button.component.regex.test(interaction.customId))
                    ) {
                        button.execute(
                            interaction,
                            client,
                            checkPerms,
                            checkChannelPerms
                        );
                        break;
                    }
                }

                // Si le composant est un formulaire
            } else if (interaction.isModalSubmit()) {
                // Parcourir chaque formulaire enregistré
                for (const [name, modal] of Modals.entries()) {
                    if (
                        // Si le formulaire n'accepte pas les Regex
                        // et que l'id de l'interaction correspond à l'id du formulaire
                        (!modal.component.regex &&
                            modal.component.id === interaction.customId) ||
                        // Ou si le formulaire accepte les Regex
                        // et que l'id de l'interaction correspond au Regex du formulaire
                        (modal.component.regex instanceof RegExp &&
                            modal.component.regex.test(interaction.customId))
                    ) {
                        modal.execute(
                            interaction,
                            client,
                            checkPerms,
                            checkChannelPerms
                        );
                        break;
                    }
                }

                // Si le composant est un menu de sélection
            } else if (
                (interaction as AnySelectMenuInteraction).isAnySelectMenu()
            ) {
                for (const [name, select_menu] of SelectMenus.entries()) {
                    if (
                        // Si le menu n'accepte pas les Regex
                        // et que l'id de l'interaction correspond à l'id du menu
                        (!select_menu.component.regex &&
                            select_menu.component.id ===
                                (interaction as AnySelectMenuInteraction)
                                    .customId) ||
                        // Ou si le menu accepte les Regex
                        // et que l'id de l'interaction correspond au Regex du menu
                        (select_menu.component.regex instanceof RegExp &&
                            select_menu.component.regex.test(
                                (interaction as AnySelectMenuInteraction)
                                    .customId
                            ))
                    ) {
                        select_menu.execute(
                            interaction as AnySelectMenuInteraction,
                            client,
                            checkPerms,
                            checkChannelPerms
                        );
                        break;
                    }
                }
            }

            // Si l'interaction est une autocomplétition
        } else if (interaction.isAutocomplete()) {
            Autocompletes.get(interaction.commandName)?.execute(
                interaction,
                client,
                checkPerms,
                checkChannelPerms
            );
        }
    }
} as PEvent<'interactionCreate'>;
