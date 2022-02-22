import { ActionPayload } from '../AppDispatcher';
import { Guild } from '../guild/Guild';

export interface RecieveGuildPayload extends ActionPayload {
    guild: Guild
}