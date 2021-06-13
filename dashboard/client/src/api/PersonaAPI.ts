import request, { Response } from 'superagent';
import { Persona, Personas } from '../personas/Personas';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

const PersonaAPI = (
    url: string,
    access: Access
) => ({
    get(
        guild: string,
        received: (personas: Personas) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/personas`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        received(new Map<string, Persona>(Object.entries(response.body)));
                    })
        );
    },

    put(
        key: string,
        guild: string,
        persona: Persona
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.put(`${url}/personas/${key}`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .send(persona)
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }
                    })
        );
    },

    remove(
        guild: string,
        key: string
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.delete(`${url}/personas/${key}`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }
                    })
        );
    }
});

export default PersonaAPI;