# Modèle de bot Discord en TypeScript

Ce modèle est un modèle de base pour vous aider à démarrer rapidement la création de votre propre bot Discord en utilisant TypeScript. Il comprend une structure de base, des exemples de commandes, de composants et de gestion d'événements pour vous aider à vous familiariser avec le développement de bots Discord.

# Fonctionnalités

Ce modèle propose des fonctionnalités préconfigurées pour simplifier la création de ton bot Discord en TypeScript. Ci-dessous, tu trouveras des exemples de fonctionnalités populaires, prêtes à être utilisées. Il est facile à comprendre et à personnaliser, ce qui te permettra de créer un bot Discord rapidement et sans te préoccuper de la configuration de base.

-   Gestions d'événements
-   Commandes
    -   Entrée de chat ("Slash")
    -   Menu contextuel de message
    -   Menu contextuel d'utilisateur
-   Composants
    -   Boutons
    -   Menus de sélection
    -   Formulaires ("modals")
-   Autocomplétions
-   Traductions ("locales" / "localizations")

# Installation

## Prérequis

-   [Node.js](https://nodejs.org/en/) v18.x.x
-   [NPM](https://www.npmjs.com/)

## Dépendances

(automatiquement installées lors de l'utilisation de `npm install`)

| Dépendance                                                 | Version           | Description                                    |
| ---------------------------------------------------------- | ----------------- | ---------------------------------------------- |
| [typescript](https://www.npmjs.com/package/typescript)     | v5.1.6            | Pour compiler le code TypeScript en JavaScript |
| [discord.js](https://www.npmjs.com/package/discord.js)     | v14.13.0          | Pour intéragir avec l'API Discord              |
| [dotenv](https://www.npmjs.com/package/dotenv)             | v16.3.1           | Pour charger les variables  d'environnement    |
| [colors](https://www.npmjs.com/package/colors)             | v1.4.0            | Pour ajouter des couleurs aux logs             |
| [moment](https://www.npmjs.com/package/moment)             | v2.29.4           | Pour afficher les heures des logs              |

## Étapes

1. Créez une application sur le portail développeur Discord ([guide](https://discord.com/developers/docs/getting-started#step-1-creating-an-app)).

   Vous aurez besoin de ces informations:
    - L'ID de votre application
    - Le token de votre bot
    - (Optionnel) L'ID de votre serveur privé (pour les commandes privées)
3. Clonez le dépôt: `git clone https://github.com/kaplego/discord-bot-template.git`
4. Accédez au dossier: `cd discord-bot-template`
5. Installez les [dépendances](#dépendances): `npm install`
6. Renommez le fichier `.env.example` en `.env` et modifiez les [variables d'environnement](#variables-denvironnement) avec les informations de votre bot et de votre serveur privé.
7. Compilez le code TypeScript vers JavaScript: `npm run build`
8. Démarrez le bot: `npm start`

# Configuration

## Variables d'environnement

| Nom de la variable    | Description                                |
| --------------------- | ------------------------------------------ |
| `BOT_ID`              | L'ID de votre bot Discord.                 |
| `BOT_TOKEN`           | Le token de votre bot Discord.             |
| `PRIVATE_SERVER_ID`   | L'ID de votre serveur privé.               |
| `BUILD_DIR`           | Le dossier de build.<sup>1</sup>           |
| `SOURCE_DIR`          | Le dossier source.<sup>1</sup>             |
| `LOGS_FOLDER`         | Le dossier de logs.                        |
| `EVENTS_FOLDER`       | Le dossier de gestion événements.          |
| `COMMANDS_FOLDER`     | Le dossier de gestion des commandes.       |
| `COMPONENTS_FOLDER`   | Le dossier de gestion des composants.      |
| `AUTOCOMPLETE_FOLDER` | Le dossier de gestion des autocomplétions. |
| `LOCALES_FOLDER`      | Le dossier des fichiers de traduction.     |

<sup>1</sup> ⚠️ Modifier les variables `BUILD_DIR` et `SOURCE_DIR` ne change pas le dossier source ou le dossier compilé. Pour changer ces dossiers, <u>vous devez également modifier le fichier `tsconfig.json`</u> (`rootDir` pour le dossier source, `outDir` pour le dossier de build).

## Structure et nommage des fichiers

-   Utilisez `$` au début du nom de fichier d'une commande pour la rendre privée (seulement utilisable dans le [serveur privé](#variables-denvironnement)).
-   Utilisez `__` au début du nom d'un fichier pour ne pas le considérer comme une commande, un composant, une autocomplétion ou un événement.
-   Les fichiers de traduction doivent être nommés selon les [localisations](https://discord.com/developers/docs/reference#locales) de Discord.

```
racine du projet/
├── source/                                    Dossier source
│   ├── events/                                Dossier des fichiers d'événements
│   │   ├── {nom évenement}.ts                 Script d'un événement
│   │   └── ...
│   ├── commands/                              Dossier des fichiers de commandes
│   │   ├── chat_input/                        Dossier des fichiers de commandes d'entrée de chat
│   │   │   ├── {nom commande}.ts              Script d'une commande slash
│   │   │   ├── ${nom commande privée}.ts      Script d'une commande slash seulement utilisable dans le serveur privé
│   │   │   ├── __{nom}.ts                     Script non configuré comme une commande slash
│   │   │   └── ...
│   │   ├── message_context/                   Dossier des fichiers de commandes de menu contextuel de message
│   │   │   ├── {nom commande}.ts              Script d'un menu contextuel de message
│   │   │   └── ...
│   │   ├── user_context/                      Dossier des fichiers de commandes de menu contextuel d'utilisateur
│   │   │   ├── {nom commande}.ts              Script d'un menu contextuel d'utilisateur
│   │   │   └── ...
│   ├── components/                            Dossier des fichiers de composants
│   │   ├── buttons/                           Dossier des fichiers de composants de boutons
│   │   │   ├── {nom composant}.ts             Script d'un bouton
│   │   │   └── ...
│   │   ├── select_menus/                      Dossier des fichiers de composants de menus de sélection
│   │   │   ├── {nom composant}.ts             Script d'un menu de sélection
│   │   │   └── ...
│   │   ├── modals/                            Dossier des fichiers de composants de formulaires
│   │   │   ├── {nom composant}.ts             Script d'un formulaire
│   │   │   └── ...
|   ├── autocompletes/                         Dossier des fichiers d'autocomplétions
|   │   ├── {nom autocomplétion}.ts            Script d'une autocomplétion
|   │   └── ...
|   ├── utils/                                 Fichiers utilitaires
|   │   ├── loaders.ts                         Fichier de chargement des commandes, composants, autocomplétions et événements
|   │   ├── localization.ts                    Fichier de gestion des traductions
|   │   ├── logs.ts                            Fichier de gestion des logs
|   │   └── utils.ts                           Fichier de fonctions utilitaires
|   ├── index.ts                               Fichier principal
|   └── types.d.ts                             Fichier de types
├── locales/                                   Dossier des fichiers de traduction
│   ├── en-GB.json                             Exemple de fichier de traduction en anglais britannique
│   ├── fr.json                                Exemple de fichier de traduction en français
│   └── ...
└── .env.example                               Fichier d'exemple de variables d'environnement (à renommer en .env et à modifier)
```

# Documentation supplémentaire

-   [Discord Developer Portal](https://discord.com/developers/docs/intro)
-   [Discord.JS](https://old.discordjs.dev/#/docs/discord.js/14.13.0/general/welcome)
-   [DiscordJS.Guide](https://discordjs.guide/)

# Crédits

Licence: [GNU GPLv3](https://github.com/kaplego/discord-bot-template/blob/main/LICENSE.md)

Auteur: [kaplego](https://github.com/kaplego)
