import AppDispatcher from "../AppDispatcher";
import { Emojis } from "../emojis/Emojis";
import ActionTypes from "./ActionTypes";
import { ReceiveEmojisPayload } from "./EmojiPayloads";

const EmojiActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_EMOJIS
        });
    },

    receive(emojis: Emojis) {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_EMOJIS,
            emojis: emojis
        } as ReceiveEmojisPayload);
    }
}

export default EmojiActions;