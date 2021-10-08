import request, { Response } from "superagent";
import { Access } from "./Access";
import { Emoji, Emojis, GuildEmojis } from "../emojis/Emojis";
import { ErrorResponse } from "./ErrorResponse";

const EmojisAPI = (
    url: string,
    access: Access
) => ({
    get(
        guild: string,
        received: (emojis: Emojis) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.get(`${url}/emojis`)
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

                        let emojis = Object.entries(response.body as { [key: string]: GuildEmojis });

                        // Tag each emoji with the id of the guild it belongs to.
                        emojis.forEach(
                            ([guildId, guildEmoji]) => {
                                guildEmoji.emojis?.forEach(
                                    (emoji: Emoji) => {
                                        emoji.guild_id = guildId;
                                    }
                                );
                            }
                        );

                        received(new Emojis(emojis));
                    })
        )
    }
});

export default EmojisAPI;