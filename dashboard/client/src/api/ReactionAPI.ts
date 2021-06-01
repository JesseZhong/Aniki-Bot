import request, { Response } from "superagent";
import { Reaction, Reactions } from "../reactions/Reactions";

const ReactionAPI = (
    url: string
) => ({
    get(
        token: string,
        guild: string,
        received: (reactions: Reactions) => void
    ): void {
        request.get(`${url}/reactions`)
            .set('Accept', 'application/json')
            .set('Guild', guild)
            .auth(token, { type: 'bearer' })
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                received(new Map<string, Reaction>(Object.entries(response.body)));
            });
    },

    put(
        token: string,
        key: string,
        guild: string,
        reaction: Reaction
    ): void {
        request.put(`${url}/reactions/${key}`)
            .set('Accept', 'application/json')
            .set('Guild', guild)
            .auth(token, { type: 'bearer' })
            .send(reaction)
            .end((error: any) => {
                if (error) {
                    return console.error(error);
                }
            });
    },

    remove(
        token: string,
        guild: string,
        key: string
    ): void {

        request.delete(`${url}/reactions/${key}`)
            .set('Accept', 'application/json')
            .set('Guild', guild)
            .auth(token, { type: 'bearer' })
            .end((error: any) => {
                if (error) {
                    return console.error(error);
                }
            });
    }
});

export default ReactionAPI;