import * as React from 'react';
import { AppState } from "./containers/AppContainer";
import { Switch, Route } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import PrivateRoute from './auth/PrivateRoute';
import Denied from './auth/Denied';
import FetchingAccess from './auth/FetchingAccess';
import RequestAuthorization from './auth/RequestAuth';
import MainPage from './main/MainPage';


const App = (state: AppState) => (
    <div className='container'>
        <div className='container-area'>
            <div className='page'>
                <Switch>
                    <Route
                        path='/denied'
                        render={() => <Denied />}
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
                        path='/authorized'
                        render={(props: any) =>
                            <FetchingAccess {...props}
                                session={state.session}
                                requestAccess={state.requestAccess}
                            />
                        }
                    />
                    <PrivateRoute
                        exact
                        path='/'
                        session={state.session}
                        render={(props: any) =>
                            <MainPage {...props}
                                personas={state.personas}
                                reactions={state.reactions}
                                setPersona={state.putPersona}
                                setReaction={state.putReaction}
                                removePersona={state.removePersona}
                                removeReaction={state.removeReaction}
                            />
                        }
                    />
                    <Route path='*' component={PageNotFound} />
                </Switch>
            </div>
        </div>
    </div>
)

export default App;