import process from 'process';
const originalEmit = process.emit;
// @ts-ignore
process.emit = function (name: any, data: any) {
    if (
        name === 'warning' &&
        typeof data === 'object' &&
        data.name === 'ExperimentalWarning' &&
        data.message.includes(
            'stream/web is an experimental feature'
        )
    ) {
        return false;
    }
    return originalEmit.apply(process, arguments);
};