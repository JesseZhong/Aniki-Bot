import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { Vanity } from '../guild/Vanity';
import { ReceiveVanityPayloads } from '../actions/VanityPayloads';


class VanityStore extends ReduceStore<Vanity, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Vanity {
        return {};
    }

    public reduce(state: Vanity, action: ActionPayload): Vanity {
        switch(action.type) {
            case ActionTypes.RECEIVE_VANITY:
                const receiveAction = action as ReceiveVanityPayloads;
                if (receiveAction) {
                    state = {
                        name: receiveAction.name
                    };
                }
                return state;

            default:
                return state;
        }
    }
}

export default new VanityStore();