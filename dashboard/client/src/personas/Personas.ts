export interface Persona {
    id: string;
    name?: string;
    avatar?: string;
}

export class Personas extends Map<string, Persona> {

    constructor(personas?: Object) {
        super();
        if (personas) {
            for (const [key, persona] of Object.entries(personas)) {
                persona.id = key;
                this.set(key, persona);
            }
        }
    }
}