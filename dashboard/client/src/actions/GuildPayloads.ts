import { ActionPayload } from '../AppDispatcher';
import { Guild } from '../guild/Guild';

export interface ReceiveGuildPayload extends ActionPayload {
    guild: Guild
}