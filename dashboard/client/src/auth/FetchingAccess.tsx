import React from 'react';
import { Link, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { faCircleNotch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session } from './Session';
import { GuildPreview } from '../guild/GuildPreview';

const AwaitAccess = (
    props: {
        session: Session,
        lookupGuild: (
            props?: RouteComponentProps,
            received?: (guild: GuildPreview) => void,
            pulled?: (id: string) => void,
            error?: () => void
        ) => void
        requestAccess: (
            state: string,
            code: string,
            received: (token: string) => void
        ) => void,
        fetchAllData: (
            token?: string,
            guild?: string
        ) => void
    }
) => {
    const history = useHistory();
    const location = useLocation();

    const goMain = () => {
        props.lookupGuild(
            undefined,
            (guild: GuildPreview) => {
                props.fetchAllData(
                    props.session?.access_token,
                    guild.id
                );
                history.push(`/${guild.id}`);
            }
        );
    }

    // NOTE: Discord OAuth service seems to call this route twice,
    // causing a second post to the API and therefore the Discord
    // token endpoint again. This causes both the API and site to error.
    // Check if the session already has a token before proceeding.
    if (props.session?.access_token) {
        goMain();
        return <div>
            <img
                src='https://media1.tenor.com/images/bf327be1ebbde7f32baf5136042bf118/tenor.gif?itemid=14563637'
                alt='To the moon!'
            />
        </div>
    };

    // When the user authorizes or denies Discord access
    // they will be routed to this component via the Discord
    // OAuth redirect_uri.
    
    // Grab the queries that were passed.
    const query = new URLSearchParams(location.search);

    // If the user denied access, an error (usually 'access_denied') is passed.
    // In this case, inform the user that authorization is required and prompt
    // them to retry the process. Retry button redirects back to the '/requestauth'.
    const error = query.get('error');
    if (error) {
        return (
            <div
                className='d-flex flex-column justify-content-center align-items-center'
                style={{
                    height: '100vh'
                }}
            >
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    size={'5x'}
                    className='text-danger'
                />
                <h1>Authorization Required!</h1>
                <p>You need to authorize access with Discord before viewing this page.</p>
                <Link
                    to='/requestauth'
                    className='btn btn-secondary'
                >
                    Retry
                </Link>
            </div>
        );
    }

    const code = query.get('code');
    const state = query.get('state');

    // Check for any kind of inconsistencies. States no matching or no
    // code could mean some kind of attack. Display this if that happens.
    if (state !== props.session.session_id || code === null) {
        return (
            <div
                className='d-flex flex-column justify-content-center align-items-center'
                style={{
                    height: '100vh'
                }}
            >
                <img
                    src='https://media1.tenor.com/images/04ab212f14107f7595857c74819a79c9/tenor.gif?itemid=9167536'
                    alt='What even?'
                />
                <h1>Incorrect State</h1>
                <p>You, uh, playing fuck, fuck games??</p>
            </div>
        );
    }

    // Ping the API to retreive the access and refresh tokens from Discord.
    // Navigate back to root once the tokens are received.
    props.requestAccess(
        state,
        code,
        goMain
    );

    return (
        <div
            className='d-flex flex-column justify-content-center align-items-center'
            style={{
                height: '100vh'
            }}
        >
            <h1>Fetching Access</h1>
            <FontAwesomeIcon
                icon={faCircleNotch}
                size={'4x'}
                spin
            />
        </div>
    );
}

export default AwaitAccess;