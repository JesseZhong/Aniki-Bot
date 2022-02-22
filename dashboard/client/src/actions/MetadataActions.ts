import { Metadata } from '../api/Metadata';
import MetadataAPI from '../api/MetadataAPI';
import GuildStore from '../stores/GuildStore';
import { AuthAccess } from './AuthActions';


const metadataApi = MetadataAPI(
    process.env.REACT_APP_API_URL ?? '',
    AuthAccess
);

const MetadataActions = {
    get(
        url: string,
        received: (metadata: Metadata) => void,
        error?: () => void
    ): void {
        const guild = GuildStore.getState();

        if (guild?.id) {
            metadataApi.post(
                guild.id,
                url,
                received
            )
        } else {
            error?.();
        }
    }
}

export default MetadataActions;