/** Représente le corps du document HTML. */
const body = document.body;

/** Représente l'élément <main> du document HTML. */
const main = document.querySelector('main') as HTMLElement;

/** Représente l'élément de sélection de niveau (balise <select>) du document HTML. */
const levelSelect = document.querySelector('.level-select') as HTMLSelectElement;

// Ajoute un écouteur d'événements pour détecter les changements dans la sélection de niveau.
levelSelect.addEventListener('change', () => {
	/** Représente tous les éléments avec la classe 'log'. */
	const logs = document.querySelectorAll('.log');

	// Parcourt tous les éléments 'log' et ajuste leur affichage en fonction de la sélection de niveau.
	logs.forEach((log: HTMLDivElement) => {
		if (levelSelect.value === 'all' || log.getAttribute('data-level') === levelSelect.value)
			log.style.display = null;
		else log.style.display = 'none';
	});

	// Fait défiler la fenêtre vers le bas pour afficher les nouveaux journaux.
	window.scrollTo({
		top: body.scrollHeight,
		behavior: 'smooth',
	});
});

// Crée des options pour les niveaux de journal et les ajoute à l'élément de sélection.
['all', 'LOG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].forEach((level) => {
	const option = document.createElement('option');
	option.value = level.toLowerCase();
	option.innerText = level;
	levelSelect.appendChild(option);
});

/** Représente l'élément de recherche (balise <input>) du document HTML. */
const search = document.querySelector('.search') as HTMLInputElement;

// Ajoute un écouteur d'événements pour détecter les changements dans la zone de recherche.
search.addEventListener('input', () => {
	/** Représente tous les éléments avec la classe 'log'. */
	const logs = document.querySelectorAll('.log');

	// Parcourt tous les éléments 'log' et ajuste leur affichage en fonction de la recherche.
	logs.forEach((log: HTMLDivElement) => {
		const text = log.querySelector('.message').textContent.toLowerCase();
		if (text.includes(search.value.toLowerCase())) log.style.display = null;
		else log.style.display = 'none';
	});

	// Fait défiler la fenêtre vers le bas pour afficher les nouveaux journaux.
	window.scrollTo({
		top: body.scrollHeight,
		behavior: 'smooth',
	});
});

// Crée une instance de WebSocket pour la communication avec le serveur local.
const ws = new WebSocket('ws://localhost:3001');

// Ajoute un écouteur d'événements pour exécuter des actions lorsque la connexion WebSocket est ouverte.
ws.addEventListener('open', () => {
	// Envoie une requête au serveur pour obtenir les journaux.
	ws.send('getLogs');
});

// Ajoute un écouteur d'événements pour traiter les messages WebSocket reçus.
ws.addEventListener('message', (event) => {
	// Convertit les données JSON reçues en objets `Log`.
	const logs = JSON.parse(event.data) as HTMLLog[];

	// Parcourt les journaux et ajoute chaque entrée de journal.
	logs.forEach((log) => {
		addLogEntry(log);

		// Fait défiler la fenêtre vers le bas pour afficher les nouveaux journaux.
		window.scrollTo({
			top: body.scrollHeight,
			behavior: 'smooth',
		});
	});
});

/**
 * Ajoute une entrée de journal à l'élément <main> du document HTML.
 * @param log Objet représentant une entrée de journal.
 * @returns L'élément <article> créé pour l'entrée de journal.
 */
function addLogEntry(log: HTMLLog): HTMLElement {
	// Sépare la chaîne de date en parties utilisables.
	const dateStrings = log.dateString.split(/-| |:/);

	// Si la chaîne de date n'est pas valide, retourne immédiatement.
	if (!dateStrings) return;

	// Crée une instance de Date à partir des parties de la chaîne de date.
	const date = new Date(
		parseInt(dateStrings[2]),
		parseInt(dateStrings[1]) - 1,
		parseInt(dateStrings[0]),
		parseInt(dateStrings[3]),
		parseInt(dateStrings[4]),
		parseInt(dateStrings[5]),
		parseInt(dateStrings[6])
	);

	// Crée un élément <article> pour l'entrée de journal.
	const logDiv = document.createElement('article');
	logDiv.classList.add('log', 'showing');
	logDiv.setAttribute('data-level', log.level.toLowerCase());
	logDiv.setAttribute('data-timestamp', date.getTime().toString());
	if (log.level !== 'LOG') logDiv.classList.add(log.level.toLowerCase());

	// Crée un élément <span> pour afficher la date de l'entrée de journal.
	const logDate = document.createElement('span');
	logDate.classList.add('date');
	logDate.innerText = `[${date.toLocaleString(undefined, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		fractionalSecondDigits: 3,
		timeZoneName: 'longOffset',
	} as Intl.DateTimeFormatOptions & {
		fractionalSecondDigits: number;
	})}]`;

	// Crée un élément <span> pour afficher le type de l'entrée de journal.
	const logType = document.createElement('span');
	logType.classList.add('type');
	logType.innerText = `[${log.paddedLevel.replace(/ /g, '\u00A0')}]`;

	// Crée un élément <p> pour afficher le contenu textuel ou HTML de l'entrée de journal.
	const logContent = document.createElement('p');
	logContent.classList.add('message');
	if (log.htmlMessage) logContent.innerHTML = log.htmlMessage;
	else logContent.innerText = log.textMessage;

	// Ajoute les éléments créés à l'élément <article> et le place dans <main>.
	logDiv.appendChild(logDate);
	logDiv.appendChild(logType);
	logDiv.appendChild(logContent);
	main.appendChild(logDiv);

	// Renvoie l'élément <article> créé.
	return logDiv;
}
