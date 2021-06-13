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
        key: string,
        guild: string,
        reaction: Reaction
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.put(`${url}/reactions/${key}`)
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
                request.delete(`${url}/reactions/${key}`)
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

export default ReactionAPI;