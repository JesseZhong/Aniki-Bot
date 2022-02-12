import GuildAPI from '../api/GuildAPI';
import AppDispatcher from '../AppDispatcher';
import { Guild } from '../guild/Guild';
import GuildStore from '../stores/GuildStore';
import VanityStore from '../stores/VanityStore';
import ActionTypes from './ActionTypes';
import { AuthAccess } from './AuthActions';
import { RecieveGuildPayload } from './GuildPayloads';
import { ReceiveVanityPayloads } from './VanityPayloads';


const guildApi = GuildAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const VanityActions = {
        
    validate: (
        name: string,
        received?: (guild: Guild) => void,
        error?: (err: any) => void
    ) => {
        const guild = GuildStore.getState();
        const vanity = VanityStore.getState();

        // Only do anything there was a change in vanity.
        if (!guild.id && name === vanity.name) {
            return;
        }

        guildApi.verifyVanity(
            name,
            (guild: Guild) => {

                // Update vanity store.
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_VANITY,
                    name: name
                } as ReceiveVanityPayloads);

                // Update the guild store with new id to use.
                AppDispatcher.dispatch({
                    type: ActionTypes.RECEIVE_GUILD,
                    guild: guild
                } as RecieveGuildPayload);

                received?.(guild);
            },
            error
        )
    },
}

export default VanityActions;