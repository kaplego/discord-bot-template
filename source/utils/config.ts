import type Discord from 'discord.js';

/** Activer ou désactiver le mode de déboguage */
const debugMode = false;

const config = {
    application: debugMode
        ? ({
              id: 'ID du bot de dev',
              publicKey: 'Clé publique du bot de dev',
              secret: 'Secret du bot de dev',
              token: 'Token du bot de dev'
          } as const)
        : ({
              id: 'ID du bot public',
              publicKey: 'Clé publique du bot public',
              secret: 'Secret du bot public',
              token: 'MTEyMjIyNTA0MjEyNjgwMjk2NA.G1djDY.tzbW_-0HD_TWvman4T2QgX8yklzX6fETuXfw2s'
          } as const),
    bot: {
        options: {
            intents: [],
            partials: ['Channel', 'GuildMembers'] as any
        } as Discord.ClientOptions
    }
};

export default config;
