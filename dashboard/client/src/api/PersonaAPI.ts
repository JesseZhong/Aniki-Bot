import request, { Response } from 'superagent';
import { Persona, Personas } from '../personas/Personas';

const PersonaAPI = (
    url: string
) => ({
    get(
        received: (personas: Personas) => void
    ): void {
        request.get(`${url}`)
            .set('Accept', 'application/json')
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                received(response.body);
            });
    },

    put(): void {

    },

    remove(): void {

    }
});

export default PersonaAPI;