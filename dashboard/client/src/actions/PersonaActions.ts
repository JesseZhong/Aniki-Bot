import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { PutPersonaPayload, ReceivePersonasPayload, RemovePersonaPayload } from './PersonaPayloads';
import { Persona, Personas } from '../personas/Personas';
import GuildStore from '../stores/GuildStore';
import PersonaAPI from '../api/PersonaAPI';
import { AuthAccess } from './AuthActions';


const personaApi = PersonaAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const PersonaActions = {
    get(): void {
        const guild = GuildStore.getState()?.id;
        if (guild) {
            personaApi.get(
                guild,
                (personas: Personas) => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.RECEIVE_PERSONAS,
                        personas: personas
                    } as ReceivePersonasPayload);
                }
            )
        }
    },

    put(persona: Persona): void {
        const guild = GuildStore.getState()?.id;
        if (guild) {
            personaApi.put(
                guild,
                persona,
                () => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.PUT_PERSONA,
                        persona: persona
                    } as PutPersonaPayload);
                }
            );
        }
    },

    remove(key: string): void {
        const guild = GuildStore.getState()?.id;
        if (guild) {
            personaApi.remove(
                guild,
                key,
                () => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.REMOVE_PERSONA,
                        key: key
                    } as RemovePersonaPayload);
                }
            );
        }
    }
}

export default PersonaActions;