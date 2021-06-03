import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

const Vanity = (props: {
    lookupVanity: (
        name: string,
        received: (id: string) => void,
        error: (err: any) => void
    ) => void
} & RouteComponentProps) => {
    const history = useHistory();
    const params = props?.match?.params;

    // If there's a vanity tag,
    // do a guild look up for it and redirect.
    if (params && 'vanity' in params) {
        props.lookupVanity(
            params['vanity'],
            (id: string) => {
                history.push(`/${id}`);
            },
            () => {
                history.push('/nope');
            }
        )
    }
    else {
        // Push to non-existent route,
        // and let the router deal with it.
        history.push('/nope');
    }

    return (
        <div
            className='d-flex justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <img
                src='https://i.imgur.com/KTnfQcq.gif'
                alt='SUUUUUP'
            />
        </div>
    )
}

export default Vanity;