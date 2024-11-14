import express from 'express';
import ws from 'ws';
import { logging } from '../..';
import Convert from 'ansi-to-html';
import { inspect } from 'util';

const convert = new Convert({
	colors: {
		0: '#000000',
		1: '#da4232',
		2: '#56b97f',
		4: '#3b70c2',
		5: '#ae48b6',
		7: '#ffffff',
	},
});

// Créer le serveur Web.
const PORT = process.env.WEBLOGS_PORT || 3005;

const app = express();

// Définir la page weblogs.
app.get('/', (_req, res) => {
	res.end(`<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weblogs</title>
        <link rel="stylesheet" href="./weblogs.css">
    </head>
    <body>
        <main></main>
        <footer>
            <select class="level-select"></select>
            <input class="search" type="text" placeholder="Search...">
        </footer>
        <script src="./weblogs.js"></script>
    </body>
    </html>`);
});

// Définir les fichiers JS et CSS.
app.get('/weblogs.js', (_req, res) => {
	res.sendFile('./script.js', {
		root: `./${process.env.BUILD_DIR}/modules/weblogs`,
	});
});

app.get('/weblogs.css', (_req, res) => {
	res.sendFile('./styles.css', {
		root: `./${process.env.SOURCE_DIR}/modules/weblogs`,
	});
});

// Lancer le serveur Web.
app.listen(PORT, () => {
	logging.info(`WebLogs started on http://localhost:${PORT}`);
});

// Créer le serveur WebSocket.
const websocket = new ws.Server({ port: 3001 });

// Transmettre les logs aux nouveaux clients.
websocket.on('connection', (client) => {
	client.on('message', (data) => {
		if (data.toString() === 'getLogs')
			client.send(
				JSON.stringify(
					inspect([
						...Object.values(
							Object.fromEntries(
								[...logging.logs.entries()].map(([key, value]: [number, Log]) => {
									return [
										key,
										{
											...value,
											htmlMessage: convert.toHtml(value.message.replace(/ /g, '\u00A0')),
										} as HTMLLog,
									];
								})
							)
						),
					]),
					(_key, value) => (typeof value === 'bigint' ? value.toString() : value)
				)
			);
	});
});

// Transmettre les nouveaux logs aux clients.
logging.addListener('logAdd', (log) => {
	websocket.clients.forEach((client) => {
		client.send(
			JSON.stringify(
				[
					{
						...log,
						htmlMessage: convert.toHtml(log.message.replace(/ /g, '\u00A0')),
					} as HTMLLog,
				],
				(_key, value) => (typeof value === 'bigint' ? value.toString() : value)
			)
		);
	});
});
