import type Discord from 'discord.js';
import { Locale } from 'discord.js';

export interface PEvent<K extends keyof Discord.ClientEvents> {
    name: K;
    once?: boolean;
    listener: (
        data: [...Discord.ClientEvents[K]],
        client: Discord.Client
    ) => Promise<void> | void;
}

abstract interface PCommand<
    I extends
        | Discord.ChatInputCommandInteraction
        | Discord.MessageContextMenuCommandInteraction
        | Discord.UserContextMenuCommandInteraction
> {
    command:
        | Discord.ChatInputApplicationCommandData
        | Discord.MessageApplicationCommandData
        | Discord.UserApplicationCommandData;
    execute: (
        interaction: I,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

export interface PCommandChatInput
    extends PCommand<Discord.ChatInputCommandInteraction> {
    command: Discord.ChatInputApplicationCommandData;
}

export interface PCommandMessageAction
    extends PCommand<Discord.MessageContextMenuCommandInteraction> {
    command: Discord.MessageApplicationCommandData;
}

export interface PCommandUserAction
    extends PCommand<Discord.UserContextMenuCommandInteraction> {
    command: Discord.UserApplicationCommandData;
}

export interface PButtonInteraction {
    component: {
        id: string;
        regex?: RegExp;
    };
    execute: (
        interaction: Discord.ButtonInteraction,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

export interface PModalInteraction {
    component: {
        id: string;
        regex?: RegExp;
    };
    execute: (
        interaction: Discord.ModalSubmitInteraction,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

export interface PSelectMenuInteraction<
    T extends Discord.SelectMenuType = Discord.SelectMenuType,
    I extends Discord.AnySelectMenuInteraction = Discord.AnySelectMenuInteraction
> {
    component: {
        id: string;
        type: T;
        regex?: RegExp;
    };
    execute: (
        interaction: I,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

export interface PChannelSelectMenuInteraction
    extends PSelectMenuInteraction<
        Discord.ComponentType.ChannelSelect,
        Discord.ChannelSelectMenuInteraction
    > {}

export interface PMentionableSelectMenuInteraction
    extends PSelectMenuInteraction<
        Discord.ComponentType.MentionableSelect,
        Discord.MentionableSelectMenuInteraction
    > {}

export interface PRoleSelectMenuInteraction
    extends PSelectMenuInteraction<
        Discord.ComponentType.RoleSelect,
        Discord.RoleSelectMenuInteraction
    > {}

export interface PStringSelectMenuInteraction
    extends PSelectMenuInteraction<
        Discord.ComponentType.StringSelect,
        Discord.StringSelectMenuInteraction
    > {}

export interface PUserSelectMenuInteraction
    extends PSelectMenuInteraction<
        Discord.ComponentType.UserSelect,
        Discord.UserSelectMenuInteraction
    > {}

export type PAnySelectMenuInteraction = PSelectMenuInteraction;

export interface PAutocomplete {
    name: string;
    execute: (
        interaction: Discord.AutocompleteInteraction,
        client: Discord.Client
    ) => Promise<unknown> | unknown;
}

export type PLocales = Locale;

export type KCommandAutocomplete = {
    command_name: string;
    execute: (
        interaction: Discord.AutocompleteInteraction,
        client: Discord.Client
    ) => any | Promise<any>;
};
