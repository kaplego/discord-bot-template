import type { Modules } from '../../types';
import { BUILD_DIR, MODULES_FOLDER, SOURCE_DIR } from '.';
import modulesGlobalConfig from '../../modules.config';
import { fs } from '..';
import { logging } from '../..';

interface PartialModule {
	name: string;
	path: string;
	dependencies: string[];
}

function sortModulesByDependencies(modules: PartialModule[]): PartialModule[] {
	const sortedModules: PartialModule[] = [];
	const unresolvedModules: PartialModule[] = [...modules];

	while (unresolvedModules.length > 0) {
		const resolvedModules: PartialModule[] = [];

		for (const module of unresolvedModules) {
			if (
				!module.dependencies ||
				module.dependencies.every((dep) => sortedModules.some((sortedModule) => sortedModule.name === dep))
			) {
				// Le module n'a pas de dépendances ou toutes ses dépendances sont déjà résolues.
				sortedModules.push(module);
				resolvedModules.push(module);
			}
		}

		// Supprime les modules résolus de la liste des modules non résolus.
		resolvedModules.forEach((module) => {
			const index = unresolvedModules.indexOf(module);
			if (index !== -1) {
				unresolvedModules.splice(index, 1);
			}
		});

		// Si aucun module n'a été résolu dans cette itération, il y a une boucle de dépendances.
		if (resolvedModules.length === 0) {
			throw new Error('Erreur : boucle de dépendances détectée !');
		}
	}

	return sortedModules;
}

export async function loadModules() {
	logging.info(' Loading modules '.bgBlue.white);
	// Vérifier que le dossier existe dans le dossier build
	if (!fs.existsSync(`${BUILD_DIR}/${MODULES_FOLDER}/`))
		// Sinon terminer la fonction
		return;

	const modulesFolders = fs.readdirSync(`${BUILD_DIR}/${MODULES_FOLDER}/`, {
		withFileTypes: true,
	});

	// Créez une liste pour stocker les modules et leurs dépendances
	const modulesList: PartialModule[] = [];

	// Parcourir les dossiers des modules
	modulesFolders.forEach((moduleFolder) => {
		// Vérifier que le dossier est un dossier
		if (!moduleFolder.isDirectory()) return;
		const folderName = moduleFolder.name;

		// Vérifier que le dossier contient un fichier de configuration
		if (!fs.existsSync(`${SOURCE_DIR}/${MODULES_FOLDER}/${folderName}/module.config.ts`)) {
			logging.error(
				`Un dossier de module ${folderName} a été trouvé mais il ne contient pas de fichier de configuration.`
			);
			return;
		}

		// Charger le fichier de configuration
		const moduleConfig = require(`../../${MODULES_FOLDER}/${folderName}/module.config`)?.default as Modules.Module;

		if (!moduleConfig) {
			logging.warn(`Impossible de charger le module ${folderName}.`);
			return;
		}

		// Vérifier que le fichier de configuration est conforme
		if (!moduleConfig.name || !moduleConfig.main) {
			logging.error(`Le fichier de configuration du module ${folderName} est invalide.`);
			return;
		}

		const moduleGlobalConfig = modulesGlobalConfig.find((module) => module.name === moduleConfig.name);

		// Vérifier que la configuration globale du module existe
		if (!moduleGlobalConfig) {
			logging.error(
				`Un module ${folderName} a été trouvé mais n'est pas déclaré dans le fichier \`modules.config.ts\`.`
			);
			return;
		}

		// Vérifier que le module est activé
		if (!moduleGlobalConfig.enabled) {
			logging.info(`  ◈ ${moduleConfig.name} (désactivé)`.gray);
			return;
		}

		// Vérifier que le fichier principal existe
		if (!fs.existsSync(`${BUILD_DIR}/${MODULES_FOLDER}/${folderName}/${moduleConfig.main}.js`)) {
			logging.error(`Le fichier principal du module ${folderName} est introuvable.`);
			return;
		}

		// Ajoutez le module et ses dépendances à la liste
		modulesList.push({
			name: moduleConfig.name,
			path: `${folderName}/${moduleConfig.main}.js`,
			dependencies: moduleConfig.modulesDependencies || [],
		});
	});

	// Tri des modules en fonction de leurs dépendances
	const sortedModules = sortModulesByDependencies(modulesList);

	// Charger les modules dans l'ordre
	for (const module of sortedModules) {
		// Charger le module
		await import(`../../${MODULES_FOLDER}/${module.path}`);

		logging.info(`  ◈ ${module.name}`.blue);
	}
}
