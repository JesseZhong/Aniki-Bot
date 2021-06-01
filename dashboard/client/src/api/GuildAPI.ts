import request, { Response } from 'superagent';
import { GuildPreview } from '../guild/GuildPreview';

const GuildAPI = (
    url: string
) => ({
    get(
        token: string,
        guild: string,
        received: (guild: GuildPreview) => void
    ): void {
        request.get(`${url}/guild`)
            .set('Accept', 'application/json')
            .set('Guild', guild)
            .auth(token, { type: 'bearer' })
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                received(response.body as GuildPreview);
            })

    }
});

export default GuildAPI;