export interface Persona {
    id: string;
    name?: string;
    avatar?: string;
}

export class Personas extends Map<string, Persona> {};