/** Boucle forEach async */
export const asyncForEach = async function <T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => any | Promise<any>
) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
