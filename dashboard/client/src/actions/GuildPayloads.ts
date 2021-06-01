import { ActionPayload } from '../AppDispatcher';
import { GuildPreview } from '../guild/GuildPreview';

export interface RecieveGuildPayload extends ActionPayload {
    guild: GuildPreview
}