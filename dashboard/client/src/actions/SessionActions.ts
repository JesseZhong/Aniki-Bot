import AppDispatcher from '../AppDispatcher';
import { Session } from '../auth/Session';
import ActionTypes from './ActionTypes';
import { SessionPayload } from './SessionPayloads';

const SessionActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_SESSION,
        });
    },

    receive(session: Session): void {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_SESSION,
            session: session
        } as SessionPayload)
    },

    set(session: Session): void {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_SESSION,
            session: session
        } as SessionPayload)
    }
}

export default SessionActions;