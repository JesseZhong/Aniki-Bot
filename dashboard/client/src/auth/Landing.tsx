import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { GuildPreview } from '../guild/GuildPreview';
import { Session } from './Session';

const Landing = (props: {
    session: Session,
    lookupGuild: (
        props: RouteComponentProps,
        received?: (guild: GuildPreview) => void,
        pulled?: (id: string) => void,
        error?: () => void
    ) => string
} & RouteComponentProps) => {
    const history = useHistory();

    props.lookupGuild(
        props,
        (guild: GuildPreview) => {

            // Check for a valid Discord access token before allowing access.
            if (props.session?.access_token) {
                history.push(`/${guild}`);
            }
            else {
                history.push('/requestauth');
            }
        },
        (id: string) => {

            // Punt user through Discord OAuth.
            // Save guild prior so it can be returned to after OAuth process.
            history.push('/requestauth');
        },
        () => {
            // No guild specified? No access.
            history.push('/denied');
        }
    );

    return (
        <div
            className='d-flex justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <img
                src='https://media1.tenor.com/images/e5eba2378d6305933a4a5f17307fda3e/tenor.gif?itemid=7932332'
                alt='Loading My Dude'
            />
        </div>
    )
}

export default Landing;