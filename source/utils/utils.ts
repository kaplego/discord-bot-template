import colors from 'colors';
import Discord from 'discord.js';
import config from './config';

colors.enable();

export function throwError(error: Error) {
    console.error(' ==== ERROR ==== '.bgRed.white);
    return error;
}

export function PromiseFn<V extends any = void>(
    ...args: ConstructorParameters<typeof Promise<V>>
): Promise<V> {
    return new Promise<V>(...args);
}

export const rest = new Discord.REST({
    version: '10'
}).setToken(config.application.token);

export const asyncForEach = async function <T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => any | Promise<any>
) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const findAverage = function (array: any[], key_name: string) {
    const { length } = array;
    return array.reduce((acc, val) => {
        return acc + val[key_name] / length;
    }, 0);
};

export const checkPerms = function (
    all: boolean = false,
    member: Discord.GuildMember,
    ...perms: ('owner' | Discord.PermissionResolvable)[]
) {
    if (all == false) {
        for (var perm of perms) {
            try {
                if (perm === 'owner') {
                    if (member.id == member.guild.ownerId) return true;
                } else if (member.permissions.has(perm)) return true;
            } catch (e) {
                return false;
            }
        }
    } else {
        for (var perm of perms) {
            try {
                if (perm === 'owner') {
                    if (member.id !== member.guild.ownerId) return false;
                } else if (!member.permissions.has(perm)) return false;
            } catch (e) {
                return false;
            }
        }
        return true;
    }
    return false;
};

export const checkChannelPerms = function (
    channel: Discord.Channel,
    all = false,
    member: Discord.GuildMember,
    ...perms: ('owner' | Discord.PermissionResolvable)[]
) {
    if (!(channel instanceof Discord.GuildChannel)) return false;
    if (all == false) {
        for (var perm of perms) {
            try {
                if (perm === 'owner') {
                    if (member.id == member.guild.ownerId) return true;
                } else if (channel.permissionsFor(member, false).has(perm))
                    return true;
            } catch (e) {
                return false;
            }
        }
    } else {
        for (var perm of perms) {
            try {
                if (perm === 'owner') {
                    if (member.id != member.guild.ownerId) return false;
                } else if (!channel.permissionsFor(member, false).has(perm))
                    return false;
            } catch (e) {
                return false;
            }
        }
        return true;
    }
    return false;
};

export function filterObject<T extends { [key: string]: any }>(
    obj: T,
    callback: (key: keyof T, val?: T[keyof T]) => boolean
): {
    [key in keyof T]: T[keyof T];
} {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, val]) => callback(key, val))
    ) as {
        [key in keyof T]: T[keyof T];
    };
}

export function sortObject<T extends { [key in PropertyKey]: any }>(obj: T): T {
    return Object.keys(obj)
        .sort()
        .reduce(function (result: { [key: string]: any }, key) {
            result[key] = obj[key];
            return result;
        }, {}) as T;
}

export function shuffle<T extends any>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export { default as fs } from 'fs';
export { default as Discord } from 'discord.js';
export { default as req } from './requests';