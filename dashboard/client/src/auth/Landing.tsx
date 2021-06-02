import React from 'react';
import { Route, RouteComponentProps, useHistory } from 'react-router-dom';
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

    return (
        <Route 
            {...props}
            render={() => {
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
                    <div>
                        Loading
                    </div>
                )
            }}
        />
    )
}

export default Landing;