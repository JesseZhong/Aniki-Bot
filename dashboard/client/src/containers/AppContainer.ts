import App from '../App';
import { Container } from 'flux/utils';
import { Personas } from '../personas/Personas';
import PersonaStore from '../stores/PersonaStore';
import { Reactions } from '../reactions/Reactions';
import ReactionStore from '../stores/ReactionStore';
import { Session } from '../auth/Session';
import SessionStore from '../stores/SessionStore';
import { Guild } from '../guild/Guild';
import GuildStore from '../stores/GuildStore';
import EmojiStore from '../stores/EmojiStore';
import { Emojis } from '../emojis/Emojis';


function getStores() {
    return [
        SessionStore,
        GuildStore,
        PersonaStore,
        ReactionStore,
        EmojiStore
    ]
}

export interface AppState {
    session: Session,
    guild: Guild,
    personas: Personas,
    reactions: Reactions,
    emojis: Emojis
}

export function getState(): AppState {
    return {
        session: SessionStore.getState(),
        guild: GuildStore.getState(),
        personas: PersonaStore.getState(),
        reactions: ReactionStore.getState(),
        emojis: EmojiStore.getState()
    }
}

export default Container.createFunctional(App, getStores, getState);