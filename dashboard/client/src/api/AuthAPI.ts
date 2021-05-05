import request, { Response } from "superagent";


interface TokenResponse {
    access_token: string;
    refresh_token: string;
    scope: string;
    permitted: boolean;
}


const AuthAPI = (
    url: string
) => ({
    requestAuthorization(
        state: string,
        received: (auth_url: string) => void
    ): void {
        request.get(`${url}/authorize`)
            .set('Accept', 'application/json')
            .set('State', state)
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                // Throw an exception if the wrong state was
                // passed back. Might be a man-in-the middle attack.
                const returnState = response.body['state'];
                if (state != returnState) {
                    console.log(`Incorrect state passed back. ${state} != ${returnState}`);
                }
                else {
                    received(response.body['auth_url']);
                }
            });
    },

    requestAccess(
        state: string,
        code: string,
        received: (
            access_token: string,
            refresh_token: string,
            permitted: boolean
        ) => void
    ): void {
        request.get(`${url}/access`)
            .set('Accept', 'application/json')
            .set('State', state)
            .set('Code', code)
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                console.log(response)

                const {
                    access_token,
                    refresh_token,
                    permitted
                } = response.body as TokenResponse;

                received(
                    access_token,
                    refresh_token,
                    permitted
                );
            });
    }
});

export default AuthAPI;