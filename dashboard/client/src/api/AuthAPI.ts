import request, { Response } from "superagent";


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
        code: string
    ): void {

    }
});

export default AuthAPI;