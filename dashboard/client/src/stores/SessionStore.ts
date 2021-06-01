import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { Session } from '../auth/Session';
import { SessionPayload } from '../actions/SessionPayloads';

class SessionStore extends ReduceStore<Session, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Session {
        return {
            session_id: ''
        };
    }

    public reduce(state: Session, action: ActionPayload): Session {
        switch(action.type) {
            case ActionTypes.RECEIVE_SESSION:
                const receiveAction: SessionPayload = action as SessionPayload;
                if (receiveAction) {
                    state = receiveAction.session;
                }
                return state;

            case ActionTypes.SET_SESSION:
                const setAction: SessionPayload = action as SessionPayload;
                state = setAction.session;
                return {...state};

            case ActionTypes.GET_SESSION:
            default:
                return state;
        }
    }
}

export default new SessionStore();