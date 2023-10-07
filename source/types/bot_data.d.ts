import type Discord from 'discord.js';
import { Base, Locale } from 'discord.js';

/**
 * Représente un écouteur d'événement.
 */
declare interface Event<K extends keyof Discord.ClientEvents> {
    /**
     * Le nom de l'événement.
     */
    name: K;
    /**
     * Si l'événement ne doit être écouté qu'une seule fois.
     */
    once?: boolean;
    /**
     * Le script à exécuter lorsque l'événement est déclenché.
     * @param data Les données de l'événement.
     * @param client Le client Discord.js.
     */
    listener: (
        data: [...Discord.ClientEvents[K]],
        client: Discord.Client
    ) => Promise<void> | void;
}

/**
 * La base des commandes slash, contextuelles de message et contextuelles d'utilisateur.
 */
abstract interface Command<
    I extends
        | Discord.ChatInputCommandInteraction
        | Discord.MessageContextMenuCommandInteraction
        | Discord.UserContextMenuCommandInteraction
> {
    /**
     * Les informations de la commande, telles que le nom, la description, ou les options.
     */
    command:
        | Discord.ChatInputApplicationCommandData
        | Discord.MessageApplicationCommandData
        | Discord.UserApplicationCommandData;
    /**
     * Les serveurs où la commande est disponible.
     * Ne pas définir cette propriété ou laisser le tableau vide rendra la commande disponible dans toutes les serveurs.
     */
    guilds?: Discord.Guild[];
    /**
     * Le script à exécuter lorsque la commande est appelée.
     * @param interaction L'interaction qui a déclenché la commande.
     * @param client Le client Discord.js.
     */
    execute: (
        interaction: I,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

/**
 * Représente une commande slash.
 */
declare interface SlashCommand
    extends Command<Discord.ChatInputCommandInteraction> {
    command: Discord.ChatInputApplicationCommandData;
}

/**
 * Représente une commande contextuelle de message.
 */
declare interface MessageCommand
    extends Command<Discord.MessageContextMenuCommandInteraction> {
    command: Discord.MessageApplicationCommandData;
}

/**
 * Représente une commande contextuelle d'utilisateur.
 */
declare interface UserCommand
    extends Command<Discord.UserContextMenuCommandInteraction> {
    command: Discord.UserApplicationCommandData;
}

declare interface BaseComponent<I extends Discord.AnyComponentInteraction> {
    /**
     * Les informations du composant.
     */
    component: {
        /**
         * L'identifiant unique du composant.
         */
        id: string;
        /**
         * Une expression régulière à définir si l'identifiant du composant est dynamique, ou si le fichier valide plusieurs boutons
         */
        regex?: RegExp;
    };
    execute: (
        interaction: I,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

/**
 * Représente un composant de type bouton.
 */
declare interface Button extends BaseComponent<Discord.ButtonInteraction> {}

/**
 * Représente un événement de soumission de formulaire.
 */
declare interface Modal extends BaseComponent<Discord.ModalSubmitInteraction> {}

declare interface BaseSelectMenu<
    T extends Discord.SelectMenuType,
    I extends Discord.AnySelectMenuInteraction = Discord.AnySelectMenuInteraction
> extends BaseComponent<I> {}

/**
 * Représente n'importe quel menu de sélection.
 */
declare interface AnySelectMenu
    extends BaseSelectMenu<
        Discord.SelectMenuType,
        Discord.AnySelectMenuInteraction
    > {}

/**
 * Représente un menu de sélection de salons.
 */
declare interface ChannelSelectMenu
    extends BaseSelectMenu<
        Discord.ComponentType.ChannelSelect,
        Discord.ChannelSelectMenuInteraction
    > {}

/**
 * Représente un menu de sélection de mentionables (rôles ou utilisateurs).
 */
declare interface MentionableSelectMenu
    extends BaseSelectMenu<
        Discord.ComponentType.MentionableSelect,
        Discord.MentionableSelectMenuInteraction
    > {}

/**
 * Représente un menu de sélection de rôles.
 */
declare interface RoleSelectMenu
    extends BaseSelectMenu<
        Discord.ComponentType.RoleSelect,
        Discord.RoleSelectMenuInteraction
    > {}

/**
 * Représente un menu de sélection d'utilisateurs.
 */
declare interface UserSelectMenu
    extends BaseSelectMenu<
        Discord.ComponentType.UserSelect,
        Discord.UserSelectMenuInteraction
    > {}

/**
 * Représente un menu de sélection de chaînes de caractères.
 */
declare interface StringSelectMenu
    extends BaseSelectMenu<
        Discord.ComponentType.StringSelect,
        Discord.StringSelectMenuInteraction
    > {}

/**
 * Représente un événement d'autocomplétion.
 */
declare interface Autocomplete {
    name: string;
    execute: (
        interaction: Discord.AutocompleteInteraction,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

export type {
    Event,
    SlashCommand,
    MessageCommand,
    UserCommand,
    Button,
    Modal,
    AnySelectMenu,
    ChannelSelectMenu,
    MentionableSelectMenu,
    RoleSelectMenu,
    StringSelectMenu,
    UserSelectMenu,
    Autocomplete
};
