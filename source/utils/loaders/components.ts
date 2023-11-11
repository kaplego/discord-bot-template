import type { Bot } from "../../types";
import { BUILD_DIR, COMPONENTS_FOLDER, SOURCE_DIR } from ".";
import { asyncForEach, fs } from "..";
import { logging } from "../..";

/** Liste les composants de type Button */
export const Buttons = new Map<string, Bot.Button>();
/** Liste des composants de type Modal */
export const Modals = new Map<string, Bot.Modal>();
/** Liste des composants de type SelectMenu */
export const SelectMenus = new Map<string, Bot.AnySelectMenu>();

/** Liste de tous les composants */
export const AllComponents = [] as (
    | Bot.Button
    | Bot.Modal
    | Bot.AnySelectMenu
)['component'][];

/**
 * Charger les composants de message
 */
export async function loadComponents(): Promise<void> {
    logging.info(' Loading components '.bgBlue.white);
    // Parcourir chaque type de composant
    for (const component_type of ['button', 'modal', 'select_menu'] as const) {
        // Passer au type suivant si `component_type` n'existe pas
        if (
            !fs.existsSync(
                `${BUILD_DIR}/${COMPONENTS_FOLDER}/${component_type}`
            )
        )
            continue;
        logging.log(`▽ ${component_type}`.green);

        /** Charger un dossier de scripts */
        async function loadDir(dir: string) {
            // Lire le contenu du dossier `dir`
            let files = fs.readdirSync(
                `${BUILD_DIR}/${COMPONENTS_FOLDER}/${dir}`,
                {
                    withFileTypes: true
                }
            );

            // Parcourir chaque fichier du dossier `dir`
            await asyncForEach(files, async (file) => {
                // Si c'est un dossier, charger les fichiers dans ce dossier et passer au fichier suivant
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
                        `${SOURCE_DIR}/${COMPONENTS_FOLDER}/${dir}/${file.name.replace(
                            /\.js$/,
                            '.ts'
                        )}`
                    )
                ) {
                    fs.rmSync(
                        `${BUILD_DIR}/${COMPONENTS_FOLDER}/${dir}/${file.name}`
                    );
                    return;
                }

                // Ignorer les fichiers dont le nom commence par "__"
                if (file.name.startsWith('__')) return;

                // Lire le fichier
                let filedata = (
                    await import(`../../${COMPONENTS_FOLDER}/${dir}/${file.name}`)
                ).default as Bot.Button | Bot.Modal | Bot.AnySelectMenu;

                // Ajouter le composant dans la liste correspondante à son type
                switch (component_type) {
                    case 'button':
                        Buttons.set(
                            filedata.component.id,
                            filedata as Bot.Button
                        );
                        break;
                    case 'modal':
                        Modals.set(
                            filedata.component.id,
                            filedata as Bot.Modal
                        );
                        break;
                    case 'select_menu':
                        SelectMenus.set(
                            filedata.component.id,
                            filedata as Bot.AnySelectMenu
                        );
                        break;
                    default:
                        logging.log(`  ◈ ${filedata.component.id}`.red);
                        return;
                }
                logging.log(`  ◈ ${filedata.component.id}`.blue);
            });
        }

        // Charger le dossier build/components/`component_type`
        await loadDir(component_type);
    }

    // Ajouter tous les composants à la liste `AllComponents`
    [...Buttons.values(), ...Modals.values(), ...SelectMenus.values()].forEach(
        (component) => AllComponents.push(component.component)
    );
}