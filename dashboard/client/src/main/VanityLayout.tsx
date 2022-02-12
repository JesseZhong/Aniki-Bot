import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import VanityActions from '../actions/VanityActions';
import { Session } from '../auth/Session';


const VanityLayout = (props: {
    session: Session
}) => {
    const navigate = useNavigate();
    const { vanity } = useParams();

    React.useEffect(() => {
            if (vanity) {
                VanityActions.validate(vanity);
            }
            else {
                navigate('/nope');
            }
        },
        [
            props.session,
            vanity
        ]
    );

    return (
        <>
            <Outlet />
        </>
    );
}

export default VanityLayout;