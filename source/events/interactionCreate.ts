import type { Bot } from '../types';
import type { AnySelectMenuInteraction } from 'discord.js';
import {
    Autocompletes,
    Buttons,
    ChatInputs,
    MessageActions,
    Modals,
    PrivateChatInputs,
    PrivateMessageActions,
    PrivateUserActions,
    SelectMenus,
    UserActions
} from '../utils/loaders';
import { logging } from '..';

export default {
    name: 'interactionCreate',
    listener([interaction], client) {
        type InteractionTypeCommand = 'Slash' | 'Message' | 'User';
        type InteractionTypeComponent = 'Button' | 'Modal' | 'SelectMenu';
        let interactionLogString:
            | ''
            | 'Error'
            | `Autocomplete`
            | `Command:${InteractionTypeCommand}${' (PRIV)' | ''}`
            | `Component:${InteractionTypeComponent}` = '';

        // Si l'interaction est une commande
        if (interaction.isCommand()) {
            interactionLogString += 'Command';

            // Si la commande est une commande de tchat
            if (
                interaction.isChatInputCommand() &&
                ChatInputs.has(interaction.commandName)
            ) {
                interactionLogString += ':Slash';
                ChatInputs.get(interaction.commandName).execute(
                    interaction,
                    client
                );
            }
            // Si la commande est un menu contextuel de message
            else if (
                interaction.isMessageContextMenuCommand() &&
                MessageActions.get(interaction.commandName)
            ) {
                interactionLogString += ':Message';
                MessageActions.get(interaction.commandName).execute(
                    interaction,
                    client
                );
            }
            // Si la commande est un menu contextuel d'utilisateur
            else if (
                interaction.isUserContextMenuCommand() &&
                UserActions.get(interaction.commandName)
            ) {
                interactionLogString += ':User';
                UserActions.get(interaction.commandName).execute(
                    interaction,
                    client
                );
            }
            // Si la commande est une commande de tchat PRIVÉE
            else if (
                interaction.isChatInputCommand() &&
                PrivateChatInputs.has(interaction.commandName)
            ) {
                interactionLogString += ':Slash (PRIV)';
                PrivateChatInputs.get(interaction.commandName).execute(
                    interaction,
                    client
                );
            }
            // Si la commande est un menu contextuel de message PRIVÉE
            else if (
                interaction.isMessageContextMenuCommand() &&
                PrivateMessageActions.get(interaction.commandName)
            ) {
                interactionLogString += ':Message (PRIV)';
                PrivateMessageActions.get(interaction.commandName).execute(
                    interaction,
                    client
                );
            }
            // Si la commande est un menu contextuel d'utilisateur PRIVÉE
            else if (
                interaction.isUserContextMenuCommand() &&
                PrivateUserActions.get(interaction.commandName)
            ) {
                interactionLogString += ':User (PRIV)';
                PrivateUserActions.get(interaction.commandName).execute(
                    interaction,
                    client
                );
            } else {
                interactionLogString = 'Error';
                interaction.reply({
                    content: 'Unknown interaction.',
                    ephemeral: true
                });
            }

            // Si l'interaction provient d'un composant
        } else if (
            interaction.isMessageComponent() ||
            interaction.isModalSubmit()
        ) {
            // Si le composant est un bouton
            if (interaction.isButton()) {
                interactionLogString = 'Component:Button';
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
                        button.execute(interaction, client);
                        break;
                    }
                }

                // Si le composant est un formulaire
            } else if (interaction.isModalSubmit()) {
                interactionLogString = 'Component:Modal';
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
                        modal.execute(interaction, client);
                        break;
                    }
                }

                // Si le composant est un menu de sélection
            } else if (interaction.isAnySelectMenu()) {
                interactionLogString += 'Component:SelectMenu';
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
                        select_menu.execute(interaction, client);
                        break;
                    }
                }
            }

            // Si l'interaction est une autocomplétition
        } else if (interaction.isAutocomplete()) {
            interactionLogString += 'Autocomplete';
            Autocompletes.get(interaction.commandName)?.execute(
                interaction,
                client
            );
        }

        logging.log(`[Interaction] ${interactionLogString}`);
    }
} as Bot.Event<'interactionCreate'>;
