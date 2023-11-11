import type { Bot } from '../../types';
import { BUILD_DIR, EVENTS_FOLDER, SOURCE_DIR } from '.';
import { Discord, asyncForEach, fs } from '..';
import { logging } from '../..';

/**
 * Charger les événements du bot.
 * @param client Le client Discord.js.
 */
export async function loadEvents(client: Discord.Client): Promise<void> {
    logging.info(' Loading events '.bgBlue.white);
    // Récupérer les fichiers du dossier "event"
    let files = fs.readdirSync(`${BUILD_DIR}/${EVENTS_FOLDER}`, {
        withFileTypes: true
    });

    // Parcourir chaque fichier
    await asyncForEach(files, async (file) => {
        // Vérifier que le fichier est un fichier javascript
        // (ex. ignorer les fichiers map)
        if (!file.name.endsWith('.js')) return;

        // Vérifier que le fichier est un fichier javascript
        // (ex. ignorer les fichiers map)
        if (!file.name.endsWith('.js')) return;

        // Vérifier que le fichier existe dans le dossier source,
        // sinon le supprimer du dossier build
        if (
            !fs.existsSync(
                `${SOURCE_DIR}/${EVENTS_FOLDER}/${file.name.replace(
                    /\.js$/,
                    '.ts'
                )}`
            )
        ) {
            fs.rmSync(`${BUILD_DIR}/${EVENTS_FOLDER}/${file.name}`);
            return;
        }

        // Ignorer les fichiers dont le nom commence par "__"
        if (file.name.startsWith('__')) return;

        // Lire le fichier
        let filedata = (await import(`../../${EVENTS_FOLDER}/${file.name}`))
            .default as Bot.Event<keyof Discord.ClientEvents>;

        logging.log(`◉ ${filedata.name}`.blue);
        // Écouter l'événement
        client.on(filedata.name, (...args) => {
            logging.log(
                `[Event]       ${filedata.name.replace(/^./, (c) =>
                    c.toUpperCase()
                )}`,
                ...args
            );
            filedata.listener([...args], client);
        });
    });
}
