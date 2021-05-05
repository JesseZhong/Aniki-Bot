import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const AwaitAccess = (
    props: {
        
    }
) => {

    return (
        <div
            className='d-flex justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <h1>Awaiting Access</h1>
            <FontAwesomeIcon icon={faCircleNotch} />
        </div>
    )
}

export default AwaitAccess;