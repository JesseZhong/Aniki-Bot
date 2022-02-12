import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import GuildActions from '../actions/GuildActions';
import { Session } from '../auth/Session';


const GuildLayout = (props: {
    session: Session
}) => {
    const navigate = useNavigate();
    const { guild } = useParams();

    React.useEffect(() => {
            if (guild) {
                GuildActions.get(guild);
            }
            else {
                navigate('/nope');
            }
        },
        [
            props.session,
            guild
        ]
    );

    return (
        <>
            <Outlet />
        </>
    );
}

export default GuildLayout;