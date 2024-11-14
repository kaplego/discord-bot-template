import type { Modules } from '../../types';

export default {
	name: 'weblogs',
	description: "Un module d'exemple pour afficher des logs sur une page web.",
	main: 'weblogs',
	nodeDependencies: {
		express: '4.18.2',
		'ansi-to-html': '0.7.2',
	},
} as Modules.Module;
