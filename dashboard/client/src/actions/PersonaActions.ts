import AppDispatcher from '../AppDispatcher';
import ActionTypes from './ActionTypes';
import { PutPersonaPayload, ReceivePersonasPayload, RemovePersonaPayload } from './PersonaPayloads';
import { Persona, Personas } from '../personas/Personas';

const PersonaActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_PERSONAS,
        });
    },

    receive(personas: Personas): void {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_PERSONAS,
            personas: personas
        } as ReceivePersonasPayload);
    },

    put(key: string, persona: Persona): void {
        AppDispatcher.dispatch({
            type: ActionTypes.PUT_PERSONA,
            key: key,
            persona: persona
        } as PutPersonaPayload);
    },

    remove(key: string): void {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_PERSONA,
            key: key
        } as RemovePersonaPayload);
    }
}

export default PersonaActions;