import React from 'react';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
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

    props.requestAuthorization(
        props.session?.session_id,
        (auth_url: string) => {
            console.log(auth_url)
        }
    )

    return (
        <div
            className='d-flex flex-column justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <h1>Requesting Authorization</h1>
            <FontAwesomeIcon
                icon={faExchangeAlt}
                size={'4x'}
            />
        </div>
    )
}

export default RequestAuthorization;