/** Boucle forEach async */
export const asyncForEach = async function <T, R extends any>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => R | Promise<R>
) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export * as Discord from 'discord.js';
export * as DiscordTypes from 'discord-api-types/v10';
export * as fs from 'fs';