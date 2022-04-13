import React from 'react';
import { useNavigate, useParams } from 'react-router';
import GuildActions from '../actions/GuildActions';
import { Session } from '../auth/Session';
import { Guild } from '../guild/Guild';
import LayoutFragment from './LayoutFragment';


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

    return <LayoutFragment guild={props.guild} />;
}

export default GuildLayout;