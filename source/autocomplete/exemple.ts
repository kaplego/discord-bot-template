import type { Bot } from '../types';
import type { ApplicationCommandOptionChoiceData } from 'discord.js';

export default {
    name: 'exemple',
    execute(interaction, client) {
        let options = (
            [
                { name: 'La Menace Fantôme', value: 'la_menace_fantome' },
                { name: "L'Attaque des Clones", value: 'lattaque_des_clones' },
                {
                    name: 'La Revanche des Siths',
                    value: 'la_revanche_des_siths'
                },
                { name: 'Un Nouvel Espoir', value: 'un_nouvel_espoir' },
                {
                    name: "L'Empire Contre-Attaque",
                    value: 'lempire_contre_attaque'
                },
                { name: 'Le Retour du Jedi', value: 'le_retour_du_jedi' },
                { name: 'Rogue One: A Star Wars Story', value: 'rogue_one' },
                { name: 'Solo: A Star Wars Story', value: 'solo' }
            ] as ApplicationCommandOptionChoiceData[]
        ).filter((v) =>
            v.name
                .toLowerCase()
                .startsWith(interaction.options.getFocused().toLowerCase())
        );

        interaction.respond(options);
    }
} as Bot.Autocomplete;
