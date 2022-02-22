import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import GuildActions from '../actions/GuildActions';
import { Session } from '../auth/Session';
import { Guild } from '../guild/Guild';
import GuildCard from '../guild/GuildCard';


const GuildLayout = (props: {
    session: Session,
    guild: Guild
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
            guild,
            navigate
        ]
    );

    return (
        <>
            <GuildCard guild={props.guild} />
            <Outlet />
        </>
    );
}

export default GuildLayout;