import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { GuildPreview } from '../guild/GuildPreview';
import { RecieveGuildPayload } from '../actions/GuildPayloads';

class GuildStore extends ReduceStore<GuildPreview, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): GuildPreview {
        return {
            id: '',
            name: ''
        };
    }

    public reduce(state: GuildPreview, action: ActionPayload): GuildPreview {
        switch(action.type) {
            case ActionTypes.RECEIVE_GUILD:
                const receiveAction: RecieveGuildPayload = action as RecieveGuildPayload;
                if (receiveAction) {
                    state = receiveAction.guild;
                }
                return state;

            case ActionTypes.GET_GUILD:
            default:
                return state;
        }
    }
}

export default new GuildStore();