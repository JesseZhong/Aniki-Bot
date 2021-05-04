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

const url = 'https://';

const personaApi = PersonaAPI(url);
const reactionApi = ReactionAPI(url);

function getStores() {
    return [
        PersonaStore,
        ReactionStore
    ]
}

export interface AppState {
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

personaApi.get(getState().receivePersonas);
reactionApi.get(getState().receiveReactions);

export default Container.createFunctional(App, getStores, getState);