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
        received: (personas: Personas) => void,
        onerror?: (error: any) => void
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
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            onerror?.(error);
                            return;
                        }

                        received(new Personas(response.body));
                    })
        );
    },

    put(
        guild: string,
        persona: Persona,
        onsuccess?: () => void,
        onerror?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.put(`${url}/personas/${persona.id}`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .send(persona)
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            onerror?.(error);
                            return;
                        }

                        if (response.status === 201) {
                            onsuccess?.();
                        }
                    })
        );
    },

    remove(
        guild: string,
        id: string,
        onsuccess?: () => void,
        onerror?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.delete(`${url}/personas/${id}`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (
                                error.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            onerror?.(error);
                            return;
                        }

                        if (response.status === 201) {
                            onsuccess?.();
                        }
                    })
        );
    }
});

export default PersonaAPI;