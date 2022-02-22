import request, { Response } from 'superagent';
import { ErrorResponse } from './ErrorResponse';


interface TokenResponse {
    access_token: string;
    refresh_token: string;
    is_admin?: boolean;
    scope: string;
}


const AuthAPI = (
    url: string
) => ({
    requestAuthorization(
        state: string,
        received: (auth_url: string) => void,
        onerror?: (error: any) => void
    ): void {
        request.get(`${url}/authorize`)
            .set('Accept', 'application/json')
            .set('State', state)
            .end((error: any, response: Response) => {
                if (error) {
                    onerror?.(error);
                    return console.error(error);
                }

                // Throw an exception if the wrong state was
                // passed back. Might be a man-in-the middle attack.
                const returnState = response.body['state'];
                if (state !== returnState) {
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
            is_admin?: boolean
        ) => void,
        onerror?: (error: any) => void
    ): void {
        request.get(`${url}/access`)
            .set('Accept', 'application/json')
            .set('State', state)
            .set('Code', code)
            .end((error: any, response: Response) => {
                if (error) {
                    onerror?.(error);
                    return console.error(error);
                }

                const {
                    access_token,
                    refresh_token,
                    is_admin
                } = response.body as TokenResponse;

                received(
                    access_token,
                    refresh_token,
                    is_admin
                );
            });
    },

    /**
     * Access an endpoint that requires authorization.
     * Handles token refreshes.
     * @param access_token
     * @param refresh_token 
     * @param action 
     * @param tokensReceived 
     */
    access(
        access_token: string,
        refresh_token: string,
        action: (
            access_token: string,
            errorHandler?: (response: ErrorResponse) => boolean
        ) => void,
        tokensReceived: (
            access_token: string,
            refresh_token: string
        ) => void,
        tokenRevoked: () => void
    ): void {
        action(
            access_token,
            (response: ErrorResponse): boolean => {
                if (response.status === 401) {

                    const body = response.body as {
                        'message': string
                    }

                    if (body.message === 'Unauthorized - Invalid Token.') {
                        request.get(`${url}/refresh`)
                            .set('Accept', 'application/json')
                            .set('Refresh', refresh_token)
                            .end((error: any, response: Response) => {
                                if (error) {
                                    return console.error(error);
                                }

                                const {
                                    access_token,
                                    refresh_token
                                } = response.body as TokenResponse;

                                tokensReceived(
                                    access_token,
                                    refresh_token
                                );

                                // Attempt action again.
                                action(access_token)
                            });

                        return true;
                    }
                    else if (body.message === 'Unauthorized - New Token Required.') {
                        tokenRevoked();
                        return false;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        )
    }
});

export default AuthAPI;