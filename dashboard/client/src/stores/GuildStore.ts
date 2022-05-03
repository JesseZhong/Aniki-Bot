import { ReduceStore } from 'flux/utils';
import AppDispatcher, { ActionPayload } from '../AppDispatcher';
import ActionTypes from '../actions/ActionTypes';
import { Guild } from '../guild/Guild';
import { ReceiveGuildPayload } from '../actions/GuildPayloads';

class GuildStore extends ReduceStore<Guild, ActionPayload> {

    public constructor() {
        super(AppDispatcher);
    }

    public getInitialState(): Guild {
        return new Guild();
    }

    public reduce(state: Guild, action: ActionPayload): Guild {
        switch(action.type) {
            case ActionTypes.RECEIVE_GUILD:
                const receiveAction: ReceiveGuildPayload = action as ReceiveGuildPayload;
                if (receiveAction) {
                    state = receiveAction.guild;
                }
                return state;

            default:
                return state;
        }
    }
}

export default new GuildStore();