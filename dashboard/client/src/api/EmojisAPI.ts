import request, { Response } from "superagent";
import { Access } from "./Access";
import { Emojis } from "../emojis/Emojis";
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

                        console.log(response.body)
                        //received(response.body);
                    })
        )
    }
});

export default EmojisAPI;