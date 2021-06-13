import request, { Response } from 'superagent';
import { GuildPreview } from '../guild/GuildPreview';
import { Access } from './Access';
import { ErrorResponse } from './ErrorResponse';

const GuildAPI = (
    url: string,
    access: Access
) => ({
    get(
        guild: string,
        received: (guild: GuildPreview) => void,
        error?: (error: any) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/guild`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .end((err: any, response: Response) => {
                        if (err) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                error?.(err);
                            }
                            return;
                        }

                        received(response.body as GuildPreview);
                    })
        );
    },

    vanity(
        guild_name: string,
        received: (guild_id: string) => void,
        error?: (error: any) => void
    ): void {
        request.get(`${url}/vanity/${guild_name}`)
            .set('Accept', 'application/json')
            .end((err: any, response: Response) => {
                if (err) {
                    error?.(err);
                    return;
                }

                const content = response.body as {
                    id: string
                };

                received(content.id);
            });
    }
});

export default GuildAPI;