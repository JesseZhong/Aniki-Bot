import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { ReceiveReactionsPayload, PutReactionPayload, RemoveReactionPayload } from '../actions/ReactionPayloads';
import { Reaction, Reactions } from '../reactions/Reactions';

class ReactionStore extends ReduceStore<Reactions, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Reactions {
        return new Map<string, Reaction>();
    }

    public reduce(state: Reactions, action: ActionPayload): Reactions {
        switch(action.type) {
            case ActionTypes.RECEIVE_REACTIONS:
                const receiveAction: ReceiveReactionsPayload = action as ReceiveReactionsPayload;
                if (receiveAction) {
                    state = receiveAction.reactions;
                }
                return state;

            case ActionTypes.PUT_REACTION:
                const putAction: PutReactionPayload = action as PutReactionPayload;
                if (putAction) {
                    state.set(putAction.id, putAction.reaction);
                }
                return new Map(state.entries());

            case ActionTypes.REMOVE_REACTION:
                const removeAction: RemoveReactionPayload = action as RemoveReactionPayload;
                if (removeAction) {
                    state.delete(removeAction.id);
                }
                return new Map(state.entries());

            case ActionTypes.GET_REACTIONS:
            default:
                return state;
        }
    }
}

export default new ReactionStore();