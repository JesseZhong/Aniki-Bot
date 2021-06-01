import React from 'react';
import { Route, RouteProps, Redirect, RouteComponentProps } from 'react-router-dom';
import { GuildPreview } from '../guild/GuildPreview';
import { Session } from './Session';

const PrivateRoute = (props: {
    session: Session,
    guild: GuildPreview,
    lookupGuild: (guild: string) => void,
    saveGuild: (guild: string) => void,
    render: (props: any) => JSX.Element
} & RouteProps) => (
    <Route 
        {...props}
        render={(routeProps: RouteComponentProps) => {

            // Track the guild being accessed
            // for each request. Change the tracked
            // guild if the slug changes.
            const params = routeProps?.match?.params;
            let guild = '';
            if (params && 'guild' in params) {
                guild = params['guild'];
                if (guild !== props.guild.id) {
                    props.lookupGuild(guild);
                }
            }

            // No guild specified? No access.
            else {
                return (<Redirect to='/denied' />);
            }

            // Check for a valid Discord access token before allowing access.
            if (props.session?.access_token) {
                return props.render(routeProps);
            }

            // Punt user through Discord OAuth.
            // Save guild prior so it can be returned to after OAuth process.
            else {
                props.saveGuild(guild);
                return (<Redirect to='/requestauth' />);
            }
        }}
    />
)

export default PrivateRoute;