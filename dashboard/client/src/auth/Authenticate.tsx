import React from 'react';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session } from './Session';

const Authenticate = (
    props: {
        session: Session
    }
) => {



    return (
        <div
            className='d-flex justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <h1>Requesting Authorization</h1>
            <FontAwesomeIcon icon={faSync} />
        </div>
    )
}

export default Authenticate;