export interface Emoji {

}

export interface GuildEmojis {
    name: string,
    icon?: string,
    emojis: Emoji[]
}

export type Emojis = Map<string, GuildEmojis>;