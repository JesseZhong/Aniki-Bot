import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { ReceiveReactionsPayload } from '../actions/ReactionPayloads';
import { Reaction, Reactions } from '../reactions/Reactions';

class ReactionStore extends ReduceStore<Reactions, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Reactions {
        return new Set<Reaction>();
    }

    public reduce(state: Reactions, action: ActionPayload): Reactions {
        switch(action.type) {
            case ActionTypes.RECEIVE_REACTIONS:
                const receiveAction: ReceiveReactionsPayload = action as ReceiveReactionsPayload;
                if (receiveAction) {
                    state = receiveAction.reactions;
                }
                return state;
            case ActionTypes.GET_REACTIONS:
            default:
                return state;
        }
    }
}

export default new ReactionStore();