import AppDispatcher from "../AppDispatcher";
import { Reaction, Reactions } from "../reactions/Reactions";
import ActionTypes from "./ActionTypes";
import { PutReactionPayload, ReceiveReactionsPayload, RemoveReactionPayload } from "./ReactionPayloads";

const ReactionActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_REACTIONS
        });
    },

    recieve(reactions: Reactions) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_REACTIONS,
            reactions: reactions
        } as ReceiveReactionsPayload);
    },

    put(reaction: Reaction) {
        AppDispatcher.dispatch({
            type: ActionTypes.PUT_REACTION,
            reaction: reaction
        } as PutReactionPayload);
    },

    remove(reaction: Reaction) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_REACTION,
            reaction: reaction
        } as RemoveReactionPayload);
    }
}

export default ReactionActions;