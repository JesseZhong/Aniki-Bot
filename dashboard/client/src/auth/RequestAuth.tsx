import React from 'react';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session } from './Session';
import AuthActions from '../actions/AuthActions';
import { useLocation } from 'react-router';
import SessionActions from '../actions/SessionActions';

const RequestAuthorization = (
    props: {
        session: Session
    }
) => {
    const session = props.session;

    // Save the user's intended location before redirecting to OAuth.
    const { pathname } = useLocation();
    session.redirect_uri = pathname;
    SessionActions.set(session);

    // The client first requests a Discord OAuth URL
    // the user can use to login and or authorize access
    // to this app using their Discord identity.
    // NOTE: Session id is passed so both the client
    // and API can verify it is the same user performing
    // these handshakes throughout the OAuth process.
    AuthActions.requestAuthorization(
        session?.session_id,
        (auth_url: string) => {

            // Redirect the user to the OAuth URL
            // as soon as it is received from the API.
            // The user will have to confirm or deny
            // if they'd like this app to have access
            // to their identity.
            window.location.href = auth_url;
        }
    )

    // Display waiting page while the OAuth URL
    // is being fetched from the API.
    return (
        <div
            className='d-flex flex-column justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <FontAwesomeIcon
                icon={faSync}
                size={'5x'}
                spin
                className='text-info'
            />
            <h1>Requesting Authorization</h1>
            <p>Please wait while we connect you.</p>
        </div>
    );
}

export default RequestAuthorization;