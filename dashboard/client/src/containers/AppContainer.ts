import { Container } from 'flux/utils';
import App from '../App';

import { Persona, Personas } from '../personas/Personas';
import PersonaActions from '../actions/PersonaActions';
import PersonaStore from '../stores/PersonaStore';
import PersonaAPI from '../api/PersonaAPI';

import { Reaction, Reactions } from '../reactions/Reactions';
import ReactionActions from '../actions/ReactionActions';
import ReactionStore from '../stores/ReactionStore';
import ReactionAPI from '../api/ReactionAPI';
import { Session, Sessions } from '../auth/Session';
import SessionStore from '../stores/SessionStore';
import SessionActions from '../actions/SessionActions';
import AuthAPI from '../api/AuthAPI';

const url = process.env.REACT_APP_API_URL ?? '';

const authApi = AuthAPI(url);
const personaApi = PersonaAPI(url);
const reactionApi = ReactionAPI(url);

// Load session.
Sessions.load(
    SessionActions.receive
);

function getStores() {
    return [
        SessionStore,
        PersonaStore,
        ReactionStore
    ]
}

export interface AppState {
    session: Session,

    requestAuthorization: (
        state: string,
        received: (auth_url: string) => void
    ) => void,

    requestAccess: (
        state: string,
        code: string,
        received: () => void
    ) => void,

    personas: Personas,
    receivePersonas: (personas: Personas) => void,
    putPersona: (key: string, persona: Persona) => void,
    removePersona: (key: string) => void,

    reactions: Reactions,
    receiveReactions: (reactions: Reactions) => void,
    putReaction: (reaction: Reaction) => void,
    removeReaction: (reaction: Reaction) => void
}

function getState(): AppState {
    return {
        session: SessionStore.getState(),

        requestAuthorization: authApi.requestAuthorization,
        requestAccess: (
            state: string,
            code: string,
            received: () => void
        ) => authApi.requestAccess(
            state,
            code,
            (
                access_token: string,
                refresh_token: string,
                permitted: boolean
            ) => {
                let session = SessionStore.getState();
                session.access_token = access_token;
                session.refresh_token = refresh_token;
                session.permitted = permitted;
                Sessions.set(session);
                SessionActions.set(session);
                received();
            }
        ),

        personas: PersonaStore.getState(),
        receivePersonas: PersonaActions.receive,
        putPersona: PersonaActions.put,
        removePersona: PersonaActions.remove,

        reactions: ReactionStore.getState(),
        receiveReactions: ReactionActions.recieve,
        putReaction: ReactionActions.put,
        removeReaction: ReactionActions.remove
    }
}

const token = getState().session.access_token;
if (token) {
    personaApi.get(token, getState().receivePersonas);
    reactionApi.get(token, getState().receiveReactions);
}

export default Container.createFunctional(App, getStores, getState);