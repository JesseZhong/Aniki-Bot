import request, { Response } from "superagent";
import { Access } from "./Access";
import { ErrorResponse } from "./ErrorResponse";
import { Metadata } from "./Metadata";

const MetadataAPI = (
    url: string,
    access: Access
) => ({
    post(
        guild: string,
        meta_url: string,
        received: (metadata: Metadata) => void
    ): void {
        access(
            (
                token: string,
                errorHandler?: (response: ErrorResponse) => boolean
            ) =>
                request.post(`${url}/metadata`)
                    .set('Accept', 'application/json')
                    .set('Guild', guild)
                    .auth(token, { type: 'bearer' })
                    .send({
                        url: meta_url
                    })
                    .end((error: any, response: Response) => {
                        if (error) {
                            if (!errorHandler?.(response as ErrorResponse)) {
                                console.error(error)
                            }
                            return;
                        }

                        received(response.body);
                    })
        )
    }
});

export default MetadataAPI;