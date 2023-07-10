import colors from 'colors';

colors.enable();

export function throwError(error: Error) {
    console.error(' ==== ERROR ==== '.bgRed.white);
    return error;
}

export const asyncForEach = async function <T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => any | Promise<any>
) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export { default as fs } from 'fs';
export { default as Discord } from 'discord.js';
