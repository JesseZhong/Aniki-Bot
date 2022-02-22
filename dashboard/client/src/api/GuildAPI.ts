import request, { Response } from 'superagent';
import { Guild } from '../guild/Guild';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

const GuildAPI = (
    url: string,
    access: Access
) => ({
    get(
        guild_id: string,
        received: (guild: Guild) => void,
        error?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/guild/${guild_id}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((err: any, response: Response) => {
                        if (err) {
                            if (
                                err.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            error?.(err);
                            return;
                        }

                        received(response.body as Guild);
                    })
        );
    },

    verifyVanity(
        guild_name: string,
        received: (guild: Guild) => void,
        error?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/guild/vanity/${guild_name}`)
                    .set('Accept', 'application/json')
                    .auth(token, { type: 'bearer' })
                    .end((err: any, response: Response) => {
                        if (err) {
                            if (
                                err.status < 500 &&
                                !errorHandler?.(response as ErrorResponse)
                            ) {
                                console.error(error)
                            }
                            error?.(err);
                            return;
                        }

                        received(response.body as Guild);
                    })
        );
    }
});

export default GuildAPI;