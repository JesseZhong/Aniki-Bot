import request, { Response } from "superagent";
import { Reaction, Reactions } from "../reactions/Reactions";
import { Access } from "./Access";
import { ErrorResponse } from "./ErrorResponse";

const ReactionAPI = (
    url: string,
    access: Access
) => ({
    get(
        guild: string,
        received: (reactions: Reactions) => void,
        onerror?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/reactions`)
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

                        received(new Reactions(response.body));
                    })
        );
    },

    put(
        guild: string,
        reaction: Reaction,
        onsuccess?: () => void,
        onerror?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.put(`${url}/reactions/${reaction.id}`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .send(reaction)
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
                request.delete(`${url}/reactions/${id}`)
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

export default ReactionAPI;