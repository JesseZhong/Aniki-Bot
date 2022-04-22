import { Guild } from "../guild/Guild";

const cdnUrl = 'https://cdn.discordapp.com';

export class Emoji {

    constructor(
        emoji: {
            id: string,
            name: string,
            animated?: boolean,
            guild_id?: string
        }
    ) {
        ({
            id: this.id,
            name: this.name,
            animated: this.animated,
            guild_id: this.guild_id
        } = emoji);
    }

    public id: string;
    public name: string;
    public animated?: boolean;
    public guild_id?: string;

    /**
     * Generate an emoji's CDN URI.
     * @param id Identifying snowflake for the emoji.
     * @param animated GIF/APNG or flat image.
     * @returns Emoji's URI.
     */
    public getEmojiUrl() {
        return `${cdnUrl}/emojis/${this.id}.${(this.animated ? 'gif' : 'png')}`;
    }
}

export class GuildEmojis extends Guild {
    emojis?: Emoji[]
}

export class Emojis extends Map<string, GuildEmojis> {

    private readonly _emoji_list: Emoji[];
    private readonly _emoji_lookup: Map<string, Emoji>;
    private readonly _guild_emoji_list: GuildEmojis[];
    private readonly _guild_lookup: Map<string, Guild>;

    public get emoji_lookup() {
        return this._emoji_lookup;
    }

    public get emoji_list() {
        return this._emoji_list
    }

    public get guild_emoji_list() {
        return this._guild_emoji_list;
    }

    public get guild_lookup() {
        return this._guild_lookup;
    }

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
            this._guild_emoji_list = guildEmojisList.map(([_key, gEmojis]) => gEmojis);

            // Get guilds by their ids.
            const guildObj = this._guild_emoji_list.reduce(
                (
                    lookup: { [key: string]: Guild },
                    gEmojis: GuildEmojis
                ) => {
                    if (gEmojis.id) {
                        lookup[gEmojis.id] = new Guild ({
                            id: gEmojis.id,
                            name: gEmojis.name,
                            icon: gEmojis.icon
                        });
                    }
                    return lookup;
                },
                {}
            );
            this._guild_lookup = new Map(Object.entries(guildObj));

            // Get a flattened list of all the emojis.
            this._emoji_list = guildEmojisList.map(([_key, gEmojis]) => gEmojis.emojis ?? []).flat();

            // Get a mapping of emoji name:id to their emojis.
            const emojiObj = this._emoji_list.reduce(
                (
                    lookup: { [key: string]: Emoji},
                    emoji: Emoji
                ) => {

                    lookup[`${emoji.name}:${emoji.id}`] = emoji;

                    return lookup;
                },
                {}
            )
            this._emoji_lookup = new Map(Object.entries(emojiObj));
        }
        else {
            this._emoji_list = [];
            this._emoji_lookup = new Map();
            this._guild_emoji_list = [];
            this._guild_lookup = new Map();
        }
    }
}