import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { PutPersonaPayload, ReceivePersonasPayload, RemovePersonaPayload } from '../actions/PersonaPayloads';
import { Persona, Personas } from '../personas/Personas';

class PersonaStore extends ReduceStore<Personas, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Personas {
        return new Map<string, Persona>();
    }

    public reduce(state: Personas, action: ActionPayload): Personas {
        switch(action.type) {
            case ActionTypes.RECEIVE_PERSONAS:
                const receiveAction: ReceivePersonasPayload = action as ReceivePersonasPayload;
                if (receiveAction) {
                    state = receiveAction.personas;
                }
                return state;

            case ActionTypes.PUT_PERSONA:
                const putAction: PutPersonaPayload = action as PutPersonaPayload;
                if (putAction) {
                    state.set(putAction.persona.id, putAction.persona);
                }
                return new Personas(Object.fromEntries(state));

            case ActionTypes.REMOVE_PERSONA:
                const removeAction: RemovePersonaPayload = action as RemovePersonaPayload;
                if (removeAction) {
                    state.delete(removeAction.key);
                }
                return new Personas(Object.fromEntries(state));

            default:
                return state;
        }
    }
}

export default new PersonaStore();