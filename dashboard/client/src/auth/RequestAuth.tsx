import React from 'react';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session } from './Session';

const RequestAuthorization = (
    props: {
        session: Session,
        requestAuthorization: (
            state: string,
            received: (auth_url: string) => void
        ) => void
    }
) => {

    // The client first requests a Discord OAuth URL
    // the user can use to login and or authorize access
    // to this app using their Discord identity.
    // NOTE: Session id is passed so both the client
    // and API can verify it is the same user performing
    // these handshakes throughout the OAuth process.
    props.requestAuthorization(
        props.session?.session_id,
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