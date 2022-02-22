import ReactionAPI from '../api/ReactionAPI';
import AppDispatcher from '../AppDispatcher';
import { Reaction, Reactions } from '../reactions/Reactions';
import GuildStore from '../stores/GuildStore';
import ActionTypes from './ActionTypes';
import { AuthAccess } from './AuthActions';
import { PutReactionPayload, ReceiveReactionsPayload, RemoveReactionPayload } from './ReactionPayloads';


const reactionApi = ReactionAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const ReactionActions = {
    get(): void {
        const guild = GuildStore.getState()?.id;
        if (guild) {
            reactionApi.get(
                guild,
                (reactions: Reactions) => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.RECEIVE_REACTIONS,
                        reactions: reactions
                    } as ReceiveReactionsPayload);
                }
            );
        }
    },

    put(reaction: Reaction) {
        const guild = GuildStore.getState()?.id;
        if (guild) {
            reactionApi.put(
                guild,
                reaction,
                () => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.PUT_REACTION,
                        reaction: reaction
                    } as PutReactionPayload);
                }
            );
        }
    },

    remove(id: string) {
        const guild = GuildStore.getState()?.id;
        if (guild) {
            reactionApi.remove(
                guild,
                id,
                () => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.REMOVE_REACTION,
                        id: id
                    } as RemoveReactionPayload);
                }
            );
        }
    }
}

export default ReactionActions;