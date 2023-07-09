import type Discord from 'discord.js';
import {
    checkPerms as CPerms,
    checkChannelPerms as CChannelPerms,
    DataTournois
} from './utils/utils';
import { Locale, Snowflake } from 'discord.js';

export type MapRound = Map<
    number,
    {
        choice1: ?{ label: string; value: string };
        choice2: ?{ label: string; value: string };
    }
>;
export type Tournoi = {
    type: keyof typeof DataTournois;
    round: number;
    rounds: MapRound;
    data: {
        value: string;
        label: string;
    }[];
    winner: ?{
        label: string;
        value: string;
    };
    user: Snowflake;
};
export type MapTournois = Map<Snowflake, Tournoi>;

export interface PEvent<K extends keyof Discord.ClientEvents> {
    name: K;
    once?: boolean;
    listener: (
        data: [...Discord.ClientEvents[K]],
        client: Discord.Client,
        checkPerms: typeof CPerms,
        checkChannelPerms: typeof CChannelPerms
    ) => Promise<void> | vpid;
}

interface PCommand<
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
        client: Discord.Client,
        checkPerms: typeof CPerms,
        checkChannelPerms: typeof CChannelPerms
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
        client: Discord.Client,
        checkPerms: typeof CPerms,
        checkChannelPerms: typeof CChannelPerms
    ) => Promise<unknown> | unknown;
}

export interface PModalInteraction {
    component: {
        id: string;
        regex?: RegExp;
    };
    execute: (
        interaction: Discord.ModalSubmitInteraction,
        client: Discord.Client,
        checkPerms: typeof CPerms,
        checkChannelPerms: typeof CChannelPerms
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
        client: Discord.Client,
        checkPerms: typeof CPerms,
        checkChannelPerms: typeof CChannelPerms
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
        client: Discord.Client,
        checkPerms: typeof CPerms,
        checkChannelPerms: typeof CChannelPerms
    ) => Promise<unknown> | unknown;
}

export type PLocales = Locale;

export type KCommandAutocomplete = {
    command_name: string;
    execute: (
        interaction: Discord.AutocompleteInteraction,
        client: Discord.Client,
        checkPerms: typeof cPerms,
        checkChannelPerms: typeof cChannelPerms
    ) => any | Promise<any>;
};

export type CustomCommandExecute = {
    type: 'MESSAGE';
    content?: string;
    embeds?: APIEmbed[];
};

export type PeyBotSnowflake = Discord.Snowflake;
