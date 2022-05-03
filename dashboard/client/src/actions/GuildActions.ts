import GuildAPI from '../api/GuildAPI';
import AppDispatcher from '../AppDispatcher';
import { Guild } from '../guild/Guild';
import ActionTypes from './ActionTypes';
import { AuthAccess } from './AuthActions';
import { ReceiveGuildPayload } from './GuildPayloads';


const guildApi = GuildAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const GuildActions = {
    get(
        guild: string
    ): void {
        guildApi.get(
            guild,
            (guild: Guild) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_GUILD,
                    guild: guild
                } as ReceiveGuildPayload);
            }
        );
    }
}

export default GuildActions;