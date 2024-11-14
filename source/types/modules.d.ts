/**
 * Définit la configuration des modules.
 */
declare type ModulesConfig = {
	name: string;
	enabled: boolean;
}[];

/**
 * Définit un module.
 */
declare interface Module {
	/**
	 * Le nom du module.
	 */
	name: string;
	/**
	 * La description du module.
	 */
	description: string;
	/**
	 * Le point d'entrée du module.
	 */
	main: string;
	/**
	 * Les dépendances NodeJS requises pour utiliser ce module.
	 * Ces dépendances sont à ajouter dans le package.json.
	 * Format: { nom: version }
	 *
	 * **ATTENTION**: Les packages ne sont pas installés automatiquement ! Vous devez le faire manuellement !
	 */
	nodeDependencies?: Record<string, string>;
	/**
	 * Les modules requis pour utiliser ce module.
	 */
	modulesDependencies?: string[];
}

export type { ModulesConfig as Config, Module };
