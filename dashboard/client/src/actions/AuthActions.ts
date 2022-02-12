import { Access } from '../api/Access';
import AuthAPI from '../api/AuthAPI';
import { ErrorResponse } from '../api/ErrorResponse';
import SessionStore from '../stores/SessionStore';
import SessionActions from './SessionActions';

export const authApi = AuthAPI(process.env.REACT_APP_API_URL ?? '');

const saveSession = (
    access_token: string,
    refresh_token: string
) => {
    // Load up session info.
    let session = SessionStore.getState();
    session.access_token = access_token;
    session.refresh_token = refresh_token;

    // Save it.
    SessionActions.set(session);
}

const resetSession = () => {
    // Clear out the existing token.
    let session = SessionStore.getState();
    delete session.access_token;
    delete session.refresh_token;

    // Save it.
    SessionActions.set(session);
}

export const AuthAccess: Access = (
    action: (
        access_token: string,
        errorHandler?: (response: ErrorResponse) => boolean
    ) => void
) => {
    const session = SessionStore.getState();
    if (session.access_token && session.refresh_token) {
        authApi.access(
            session.access_token,
            session.refresh_token,
            action,
            saveSession,
            resetSession
        )
    }
}

const AuthActions = {
    
    requestAuthorization: (
        state: string,
        received: (auth_url: string) => void,
        onerror?: (error: any) => void
    ) => authApi.requestAuthorization(
        state,
        received,
        onerror
    ),

    requestAccess: (
        state: string,
        code: string,
        received: (token: string) => void,
        onerror?: (error: any) => void
    ) => authApi.requestAccess(
        state,
        code,
        (
            access_token: string,
            refresh_token: string,
            is_admin?: boolean
        ) => {
            saveSession(
                access_token,
                refresh_token
            );
            received(access_token);
        },
        onerror
    )
}

export default AuthActions;