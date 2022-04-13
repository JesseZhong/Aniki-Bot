import React from 'react';
import { useNavigate, useParams } from 'react-router';
import VanityActions from '../actions/VanityActions';
import { Session } from '../auth/Session';
import { Guild } from '../guild/Guild';
import LayoutFragment from './LayoutFragment';


const VanityLayout = (props: {
    session: Session,
    guild: Guild
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
            vanity,
            navigate
        ]
    );

    return <LayoutFragment guild={props.guild} />;
}

export default VanityLayout;