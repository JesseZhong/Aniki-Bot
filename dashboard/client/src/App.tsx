import * as React from 'react';
import { AppState } from "./containers/AppContainer";
import { Switch, Route } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import PersonasPage from './personas/PersonasPage';
import ReactionsPage from './reactions/ReactionsPage';
import PrivateRoute from './auth/PrivateRoute';
import Denied from './auth/Denied';
import AwaitAccess from './auth/AwaitAccess';
import Authenticate from './auth/Authenticate';
import RequestAuthorization from './auth/RequestAuth';

const App = (state: AppState) => (
    <div className='page'>
        <Switch>
            <Route
                path='/denied'
                render={(props: any) => <Denied />}
            />
            <Route
                path='/requestauth'
                render={(props: any) =>
                    <RequestAuthorization {...props}
                        session={state.session}
                        requestAuthorization={state.requestAuthorization}
                    />}
            />
            <Route
                path='/authenticate'
                render={(props: any) => <Authenticate {...props} />}
            />
            <Route
                path='/authorized'
                render={(props: any) => <AwaitAccess />}
            />
            <PrivateRoute
                path='/reactions'
                session={state.session}
                render={(props: any) => <ReactionsPage {...props} reactions={state.reactions} />}
            />
            <PrivateRoute
                path='/personas'
                session={state.session}
                render={(props: any) => <PersonasPage {...props} personas={state.personas} />}
            />
            <PrivateRoute
                exact
                path='/'
                session={state.session}
                render={(props: any) => <ReactionsPage {...props} reactions={state.reactions} />}
            />
            <Route path='*' component={PageNotFound} />
        </Switch>
    </div>
)

export default App;