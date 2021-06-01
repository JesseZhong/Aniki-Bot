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
    lookupGuild: (id: string) => void,
    saveGuild: (guild: string) => void,
    popGuild: (
        token: string,
        received: (guild: string) => void
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
        lookupGuild: (id: string) => {
            const token = SessionStore.getState().access_token;
            if (token) {
                guildApi.get(
                    token,
                    id,
                    GuildActions.recieve
                );
            }
        },
        saveGuild: (guild: string) => {
            if (guild) {
                Guild.set(guild);
            }
        },
        popGuild: (
            token: string,
            received: (guild: string) => void
        ) => {
            Guild.load(
                (guild: string) => {
                    guildApi.get(
                        token,
                        guild,
                        (guildPreview: GuildPreview) => {
                            GuildActions.recieve(guildPreview);
                            //Guild.remove();
                            received(guild);
                        }
                    )
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

// Fetch data if existing session is valid.
const token = getState().session.access_token;
const guild = getState().guild.id;
getState().fetchAllData(token, guild)

export default Container.createFunctional(App, getStores, getState);