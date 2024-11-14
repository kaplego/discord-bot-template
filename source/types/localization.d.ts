type localesObject = {
	[key: string]: string | localesObject;
};

type LocalesMap = Map<Locale, localesObject>;

/**
 * Un objet contenant des méthodes pour obtenir les traductions d'une commande.
 */
declare interface CommandLocalesManager {
	getOne(name: string, locale?: Locale): string;
	get(name: string):
		| {
				[key in Locale]?: string;
		  }
		| null;
	/**
	 * Récupérer les traductions d'une option d'une commande.
	 * @param optionName Le nom de l'option.
	 * @returns Un objet contenant des méthodes pour obtenir les traductions de l'option.
	 */
	option(optionName: string): OptionLocalesManager;
}

/**
 * Un objet contenant des méthodes pour obtenir des traductions d'une option.
 */
interface OptionLocalesManager {
	getOne(name: string, locale?: Locale): string;
	get(name: string):
		| {
				[key in Locale]?: string;
		  }
		| null;
	/**
	 * Récupérer les traductions d'un choix d'une option.
	 * @param choiceName Le nom du choix.
	 * @returns Un objet contenant des méthodes pour obtenir les traductions du choix.
	 */
	choice(choiceName: string): ChoiceLocalesManager;
}

/**
 * Un objet contenant des méthodes pour obtenir des traductions d'un choix.
 */
interface ChoiceLocalesManager {
	getOne(name: string, locale?: Locale): string;
	get(name: string):
		| {
				[key in Locale]?: string;
		  }
		| null;
}
