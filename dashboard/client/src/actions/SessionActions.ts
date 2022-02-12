import AppDispatcher from '../AppDispatcher';
import { Session, Sessions } from '../auth/Session';
import ActionTypes from './ActionTypes';
import { SessionPayload } from './SessionPayloads';

const SessionActions = {
    load(): void {

        // Load session.
        Sessions.load(
            (session: Session) => {
        
                AppDispatcher.dispatch({
                    type: ActionTypes.LOAD_SESSION,
                    session: session

                } as SessionPayload);
            }
        );
    },

    set(session: Session): void {
        Sessions.set(session);
        AppDispatcher.dispatch({
            type: ActionTypes.SET_SESSION,
            session: session
        } as SessionPayload)
    }
}

export default SessionActions;