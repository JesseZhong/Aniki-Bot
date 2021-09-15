import { ActionPayload } from "../AppDispatcher";
import { Emojis } from "../emojis/Emojis";

export interface ReceiveEmojisPayload extends ActionPayload {
    emojis: Emojis
}