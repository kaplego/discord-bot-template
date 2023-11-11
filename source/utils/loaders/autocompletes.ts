import type { Bot } from '../../types';
import { BUILD_DIR, AUTOCOMPLETE_FOLDER, SOURCE_DIR } from '.';
import { asyncForEach, fs } from '..';
import { logging } from '../..';

export const Autocompletes = new Map<string, Bot.Autocomplete>();

/**
 * Charger les autocomplétions de commande.
 */
export async function loadAutocompletes(): Promise<void> {
    logging.info(' Loading autocompletes '.bgBlue.white);
    // Vérifier que le dossier existe dans le dossier build
    if (!fs.existsSync(`${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/`))
        // Sinon terminer la fonction
        return;

    /** Charger un dossier de scripts */
    async function loadDir(dir: string) {
        // Lire le contenu du dossier `dir`
        await asyncForEach(
            fs.readdirSync(`${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}`, {
                withFileTypes: true
            }),
            async (file) => {
                // Si c'est un dossier, charger les fichiers dans ce dossier et terminer la fonction
                if (file.isDirectory()) {
                    await loadDir(`${dir}/${file.name}`);
                    return;
                } else if (!file.isFile()) return;

                // Vérifier que le fichier est un fichier javascript
                // (ex. ignorer les fichiers map)
                if (!file.name.endsWith('.js')) return;

                // Vérifier que le fichier existe dans le dossier source,
                // sinon le supprimer du dossier build
                if (
                    !fs.existsSync(
                        `${SOURCE_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}/${file.name.replace(
                            /\.js$/,
                            '.ts'
                        )}`
                    )
                ) {
                    fs.rmSync(
                        `${BUILD_DIR}/${AUTOCOMPLETE_FOLDER}/${dir}/${file.name}`
                    );
                    return;
                }

                // Ignorer les fichiers dont le nom commence par "__"
                if (file.name.startsWith('__')) return;

                // Lire le fichier
                let filedata = (
                    await import(
                        `../../${AUTOCOMPLETE_FOLDER}/${dir}/${file.name}`
                    )
                ).default as Bot.Autocomplete;

                logging.log(`◉ ${filedata.name}`.blue);
                // Ajouter le fichier et son contenu dans la liste des autocomplétitions
                Autocompletes.set(filedata.name, filedata as Bot.Autocomplete);
            }
        );
    }

    // Charger le dossier build/commands
    await loadDir('');
}
