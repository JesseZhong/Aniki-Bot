import { ActionPayload } from "../AppDispatcher";
import { Session } from "../auth/Session";

export interface SessionPayload extends ActionPayload {
    session: Session
}