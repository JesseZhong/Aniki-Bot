import { Guild } from "../guild/Guild";

export interface Emoji {
    id: string,
    name: string,
    animated?: boolean,
    guild_id?: string
}

export interface GuildEmojis {
    id: string,
    name: string,
    icon?: string,
    emojis?: Emoji[]
}

export class Emojis extends Map<string, GuildEmojis> {

    public readonly emoji_list: Emoji[];
    public readonly emoji_lookup: Map<string, Emoji>;
    public readonly guild_emoji_list: GuildEmojis[];
    public readonly guild_lookup: Map<string, Guild>;

    constructor(
        entries?: readonly (
            readonly [string, GuildEmojis]
        )[] | null
    ) {
        super(entries);

        if (entries) {
            
            // Get list of entries.
            const guildEmojisList = [...entries.values()]

            // Get just a list of guild emojis without the guild id.
            this.guild_emoji_list = guildEmojisList.map(([_key, gEmojis]) => gEmojis);

            // Get guilds by their ids.
            const guildObj = this.guild_emoji_list.reduce(
                (
                    lookup: { [key: string]: Guild },
                    gEmojis: GuildEmojis
                ) => {
                    lookup[gEmojis.id] = {
                        id: gEmojis.id,
                        name: gEmojis.name,
                        icon: gEmojis.icon
                    };
                    return lookup;
                },
                {}
            );
            this.guild_lookup = new Map(Object.entries(guildObj));

            // Get a flattened list of all the emojis.
            this.emoji_list = guildEmojisList.map(([_key, gEmojis]) => gEmojis.emojis ?? []).flat();

            // Get a mapping of emoji name:id to their emojis.
            const emojiObj = this.emoji_list.reduce(
                (
                    lookup: { [key: string]: Emoji},
                    emoji: Emoji
                ) => {

                    lookup[`${emoji.name}:${emoji.id}`] = emoji;

                    return lookup;
                },
                {}
            )
            this.emoji_lookup = new Map(Object.entries(emojiObj));
        }
        else {
            this.emoji_list = [];
            this.emoji_lookup = new Map();
            this.guild_emoji_list = [];
            this.guild_lookup = new Map();
        }
    }
}