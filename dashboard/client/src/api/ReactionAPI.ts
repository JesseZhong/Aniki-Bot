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
        received: (reactions: Reactions) => void
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
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        received(new Map<string, Reaction>(Object.entries(response.body)));
                    })
        );
    },

    put(
        guild: string,
        reaction: Reaction,
        onSuccess?: () => void
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
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        if (response.status === 201) {
                            onSuccess?.();
                        }
                    })
        );
    },

    remove(
        guild: string,
        id: string,
        onSuccess?: () => void
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
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        if (response.status === 201) {
                            onSuccess?.();
                        }
                    })
        );
    }
});

export default ReactionAPI;