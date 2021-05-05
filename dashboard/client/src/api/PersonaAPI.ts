import request, { Response } from 'superagent';
import { Persona, Personas } from '../personas/Personas';

const PersonaAPI = (
    url: string
) => ({
    get(
        token: string,
        received: (personas: Personas) => void
    ): void {
        request.get(`${url}/personas`)
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' })
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                received(response.body);
            });
    },

    put(
        token: string,
        key: string,
        persona: Persona
    ): void {
        request.put(`${url}/personas/${key}`)
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' })
            .send(persona)
            .end((error: any) => {
                if (error) {
                    return console.error(error);
                }
            });
    },

    remove(
        token: string,
        key: string
    ): void {

        request.delete(`${url}/personas/${key}`)
            .set('Accept', 'application/json')
            .auth(token, { type: 'bearer' })
            .end((error: any) => {
                if (error) {
                    return console.error(error);
                }
            });
    }
});

export default PersonaAPI;