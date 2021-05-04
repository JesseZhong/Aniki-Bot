import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { ReceivePersonasPayload } from '../actions/PersonaPayloads';
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

            case ActionTypes.GET_PERSONAS:
            default:
                return state;
        }
    }
}

export default new PersonaStore();