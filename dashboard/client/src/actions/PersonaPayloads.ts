import { ActionPayload } from '../AppDispatcher';
import { Persona, Personas } from '../personas/Personas';

export interface ReceivePersonasPayload extends ActionPayload {
    personas: Personas;
}

export interface PutPersonaPayload extends ActionPayload {
    persona: Persona;
}

export interface RemovePersonaPayload extends ActionPayload {
    key: string;
}