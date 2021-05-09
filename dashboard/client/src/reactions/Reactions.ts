export interface Reaction {
    triggers: string[];
    
    audio_url: string,
    start: string,
    end: string,
    volume: number,

    content: string,
    persona: string
}

export type Reactions = Map<string, Reaction>;