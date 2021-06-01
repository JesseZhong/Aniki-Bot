import * as ls from 'local-storage';
import uuid from 'node-uuid';
import { User } from './User';

const key = 'session';

export interface Session {
    session_id: string;
    access_token?: string;
    refresh_token?: string;
    user?: User;
}

export const Sessions = {

    /**
     * Attempt to resume or create a session.
     */
    load: (
        receive: (session: Session) => void
    ) => {

        // Attempt to resume a session.
        let session = ls.get(key) as Session;

        // No session found? Make a new one.
        if (!session?.session_id) {

            session = {
                session_id: uuid.v4()
            };

            // Put the session in local storage.
            ls.set(key, session);
        }

        receive(session);
    },

    /**
     * Save the session to storage.
     */
    set: (session: Session) => {
        ls.set(key, session);
    }
}