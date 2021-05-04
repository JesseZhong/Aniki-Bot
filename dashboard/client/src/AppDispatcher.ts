import { Dispatcher } from 'flux';

export interface ActionPayload {
    type: string
}

export default new Dispatcher<ActionPayload>();