import AppDispatcher from '../AppDispatcher';
import { GuildPreview } from '../guild/GuildPreview';
import ActionTypes from './ActionTypes';
import { RecieveGuildPayload } from './GuildPayloads';

const GuildActions = {
    get(): void {
        AppDispatcher.dispatch({
            type: ActionTypes.GET_GUILD
        });
    },

    recieve(guild: GuildPreview): void {
        AppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_GUILD,
            guild: guild
        } as RecieveGuildPayload);
    }
}

export default GuildActions;