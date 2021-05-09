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

    put(key: string, reaction: Reaction) {
        AppDispatcher.dispatch({
            type: ActionTypes.PUT_REACTION,
            key: key,
            reaction: reaction
        } as PutReactionPayload);
    },

    remove(key: string) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_REACTION,
            key: key
        } as RemoveReactionPayload);
    }
}

export default ReactionActions;