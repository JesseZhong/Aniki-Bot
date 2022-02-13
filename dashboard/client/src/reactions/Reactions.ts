export interface Reaction {
    id: string,
    triggers: string[];
    
    audio_url?: string,
    start?: string,
    end?: string,
    clip?: [number, number],
    volume?: number,

    content?: string,
    persona?: string
}

export class Reactions extends Map<string, Reaction> {};