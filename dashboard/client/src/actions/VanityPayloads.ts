import { ActionPayload } from '../AppDispatcher';

export interface ReceiveVanityPayloads extends ActionPayload {
    name: string
}