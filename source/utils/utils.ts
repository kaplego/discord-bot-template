import colors from 'colors';
import { logging } from '..';

colors.enable();

/** Renvoyer une erreur et terminer l'exécution du code */
export function throwError(error: Error, t: boolean = false) {
    logging.error(' ==== ERROR ==== '.bgRed.white);

    if (t)
        throw error;
    return error;
}

/** Boucle forEach async */
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
