import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { faCircleNotch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session } from './Session';

const AwaitAccess = (
    props: {
        session: Session,
        requestAccess: (
            state: string,
            code: string
        ) => void
    }
) => {

    // When the user authorizes or denies Discord access
    // they will be routed to this component via the Discord
    // OAuth redirect_uri.
    
    // Grab the queries that were passed.
    const query = new URLSearchParams(useLocation().search);

    // If the user denied access, an error (usually 'access_denied') is passed.
    // In this case, inform the user that authorization is required and prompt
    // them to retry the process. Retry button redirects back to the '/requestauth'.
    const error = query.get('error');
    if (error) {
        return (
            <div
                className='d-flex flex-column justify-content-center align-items-center'
                style={{
                    height: '100vh'
                }}
            >
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    size={'5x'}
                    className='text-danger'
                />
                <h1>Authorization Required!</h1>
                <p>You need to authorize access with Discord before viewing this page.</p>
                <Link
                    to='/requestauth'
                    className='btn btn-secondary'
                >
                    Retry
                </Link>
            </div>
        );
    }

    const code = query.get('code');
    const state = query.get('state');

    return (
        <div
            className='d-flex flex-column justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <h1>Fetching Access</h1>
            <FontAwesomeIcon
                icon={faCircleNotch}
                size={'4x'}
                spin
            />
        </div>
    );
}

export default AwaitAccess;