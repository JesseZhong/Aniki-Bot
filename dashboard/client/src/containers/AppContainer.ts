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
import GuildAPI from '../api/GuildAPI';
import { Guild, GuildPreview } from '../guild/GuildPreview';
import GuildStore from '../stores/GuildStore';
import GuildActions from '../actions/GuildActions';
import { RouteComponentProps } from 'react-router-dom';

const url = process.env.REACT_APP_API_URL ?? '';

const authApi = AuthAPI(url);
const personaApi = PersonaAPI(url);
const reactionApi = ReactionAPI(url);
const guildApi = GuildAPI(url);

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
        received: (token: string) => void
    ) => void,

    guild: GuildPreview,
    lookupGuild: (
        props?: RouteComponentProps,
        received?: (guild: GuildPreview) => void,
        pulled?: (id: string) => void,
        error?: () => void
    ) => void,

    personas: Personas,
    receivePersonas: (personas: Personas) => void,
    putPersona: (key: string, persona: Persona) => void,
    removePersona: (key: string) => void,

    reactions: Reactions,
    receiveReactions: (reactions: Reactions) => void,
    putReaction: (key: string, reaction: Reaction) => void,
    removeReaction: (key: string) => void,

    fetchAllData: (
        token?: string,
        guild?: string
    ) => void
}

function getState(): AppState {
    return {
        session: SessionStore.getState(),

        requestAuthorization: authApi.requestAuthorization,
        requestAccess: (
            state: string,
            code: string,
            received: (token: string) => void
        ) => authApi.requestAccess(
            state,
            code,
            (
                access_token: string,
                refresh_token: string
            ) => {
                // Load up session info.
                let session = SessionStore.getState();
                session.access_token = access_token;
                session.refresh_token = refresh_token;

                // Save it.
                Sessions.set(session);
                SessionActions.set(session);

                received(access_token);
            }
        ),

        guild: GuildStore.getState(),
        lookupGuild: (
            props?: RouteComponentProps,
            received?: (guild: GuildPreview) => void,
            pulled?: (id: string) => void,
            error?: () => void
        ): void => {
            const guild = GuildStore.getState();
            const session = SessionStore.getState();

            const process = (id: string) => {
                if (session?.access_token) {
                    guildApi.get(
                        session.access_token,
                        id,
                        (guild: GuildPreview) => {
                            GuildActions.recieve(guild);
                            received?.(guild);
                        }
                    );
                }
                else {
                    pulled?.(id);
                    Guild.set(id);
                }
            }

            // Try to pop it from storage if it's there.
            Guild.load(
                (id: string) => {
                    Guild.remove();
                    process(id);
                },
                () => {
    
                    // Track the guild being accessed
                    // for each request. Change the tracked
                    // guild if the slug changes.
                    const params = props?.match?.params;
                    let id = '';
        
                    if (params && 'guild' in params) {
                        id = params['guild'];
        
                        if (id && id !== guild.id) {
                            process(id)
                        }
                    }
                    else {
                        error?.();
                    }
                }
            );
        },

        personas: PersonaStore.getState(),
        receivePersonas: PersonaActions.receive,
        putPersona: PersonaActions.put,
        removePersona: PersonaActions.remove,

        reactions: ReactionStore.getState(),
        receiveReactions: ReactionActions.recieve,
        putReaction: ReactionActions.put,
        removeReaction: (key: string) => {
            const token = SessionStore.getState().access_token;
            const guild = GuildStore.getState().id;
            if (token) {
                reactionApi.remove(token, guild, key);
                ReactionActions.remove(key);
            }
        },

        fetchAllData: (
            token?: string,
            guild?: string
        ) => {
            if (token && guild) {
                personaApi.get(token, guild, getState().receivePersonas);
                reactionApi.get(token, guild, getState().receiveReactions);
            }
        }
    }
}

export default Container.createFunctional(App, getStores, getState);