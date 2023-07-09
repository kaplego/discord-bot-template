import type Discord from 'discord.js';

const config = {
    config: {
        debug: true
    },
    application: {
        id: '1122225042126802964',
        publicKey: '73c07f5d3df19ef7ba9bbf3cdc3d985b5544dd7c21a689e51196c2f86072bcb5',
        secret: 'vlPdYINiIo7WqDRvwNtGGII9wk5GOt2O',
        token: 'MTEyMjIyNTA0MjEyNjgwMjk2NA.G1djDY.tzbW_-0HD_TWvman4T2QgX8yklzX6fETuXfw2s'
    },
    bot: {
        options: {
            intents: [
                'MessageContent',
                'GuildMessages',
                'DirectMessages',

                'GuildMessageReactions',
                'DirectMessageReactions',

                'Guilds',
                'GuildBans',
                'GuildVoiceStates'
            ],
            partials: ['Channel', 'GuildMembers'] as any
        } as Discord.ClientOptions
    },
    about: {
        version: '0.1.0',
        website: 'https://www.peybot.com'
    },
    notion: {
        token: 'secret_TAUuFCar7MXntExtmZ8cXyL660GDc9PZ2Q3gb3bBO9j',
        databases: {
            feedback: '66bc184e-9c8e-42ed-840d-b465e60e58da'
        }
    },
    vars: {
        colors: {
            blue1_hex: '#0080CF' as Discord.HexColorString,
            blue1_dec: 32975,
            blue2_hex: '#0F8DDB' as Discord.HexColorString,
            blue2_dec: 1019355,
            blue3_hex: '#1F94DD' as Discord.HexColorString,
            blue3_dec: 2069725,
            blue4_hex: '#2D99DD' as Discord.HexColorString,
            blue4_dec: 2988509,
            gray_embed: '#2F3136' as Discord.HexColorString,
            gray_embed_dec: 3092790,
            youtube_red: '#FF0000' as Discord.HexColorString,
            youtube_red_dec: 16711680
        },
        support: {
            guild_id: '675065446935822344',
            category_id: '961595099911962725'
        }
    },
    mod: {
        banned_words: [
            'shit',
            'slut',
            'pute',
            'putain',
            'salope',
            'bite',
            'dick',
            'cock',
            'cul',
            'ass'
        ]
    },
    youtube_tokens: {
        current: 0,
        list: [
            'AIzaSyBA-6tXf2t30sCRANigISVZ3KoKXNRmW2g',
            'AIzaSyAOjz2h_WyljfEiYS6pyEhdxcinSbE1xfc'
        ]
    }
};

export default config;
