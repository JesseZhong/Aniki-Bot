import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { Session } from './Session';

export default (props: {
    session: Session,
    render: (props: any) => JSX.Element
} & RouteProps) => (
    <Route 
        {...props}
        render={(routeProps: any) => (
            props.session?.access_token
            ? props.session?.permitted == true
                ? props.render(routeProps)
                : <Redirect to='/denied' />
            : <Redirect to='/requestauth' />
        )}
    />
)