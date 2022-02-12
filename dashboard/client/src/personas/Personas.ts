export interface Persona {
    id: string;
    name?: string;
    avatar?: string;
}

export type Personas = Map<string, Persona>;