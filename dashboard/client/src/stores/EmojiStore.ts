import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { Emojis } from '../emojis/Emojis';
import { ReceiveEmojisPayload } from '../actions/EmojiPayloads';

class EmojiStore extends ReduceStore<Emojis, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Emojis {
        return new Map;
    }

    public reduce(state: Emojis, action: ActionPayload): Emojis {
        switch(action.type) {
            case ActionTypes.RECEIVE_EMOJIS:
                const receiveAction: ReceiveEmojisPayload = action as ReceiveEmojisPayload;
                if (receiveAction) {
                    state = receiveAction.emojis;
                }
                return state;

            case ActionTypes.GET_EMOJIS:
            default:
                return state;
        }
    }
}

export default new EmojiStore();