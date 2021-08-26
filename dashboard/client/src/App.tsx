import * as React from 'react';
import { AppState } from "./containers/AppContainer";
import { Switch, Route, Redirect } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import Denied from './auth/Denied';
import FetchingAccess from './auth/FetchingAccess';
import RequestAuthorization from './auth/RequestAuth';
import MainPage from './main/MainPage';
import Landing from './auth/Landing';
import { GuildPreview } from './guild/GuildPreview';
import Vanity from './guild/Vanity';


const App = (state: AppState) => {

    const vanity = <Route
        exact
        path='/g/:vanity([a-zA-Z0-9_]{2,100})'
        render={(props: any) =>
            <Vanity
                {...props}
                lookupVanity={state.lookupVanity}
            />
        }
    />

    const route = () => {
        if (state.session?.access_token) {
            return (
                <Switch>
                    {vanity}
                    <Route
                        exact
                        path='/:guild([0-9]{5,19})'
                        render={(props: any) => {

                            // Fetch data if guild specified is different.
                            state.lookupGuild(
                                props,
                                (guild: GuildPreview) => {
                                    state.fetchAllData(guild.id);
                                }
                            );

                            return (
                                <MainPage {...props}
                                    personas={state.personas}
                                    reactions={state.reactions}
                                    setPersona={state.putPersona}
                                    setReaction={state.putReaction}
                                    removePersona={state.removePersona}
                                    removeReaction={state.removeReaction}
                                />
                            )
                        }}
                    />
                    <Route path='*' component={PageNotFound} />
                </Switch>
            )
        }

        else {
            return (
                <Switch>
                    {vanity}
                    <Route
                        exact
                        path='/denied'
                        component={Denied}
                    />
                    <Route
                        exact
                        path='/requestauth'
                        render={(props: any) =>
                            <RequestAuthorization {...props}
                                session={state.session}
                                requestAuthorization={state.requestAuthorization}
                            />}
                    />
                    <Route
                        exact
                        path='/authorized'
                        render={(props: any) =>
                            <FetchingAccess {...props}
                                session={state.session}
                                lookupGuild={state.lookupGuild}
                                requestAccess={state.requestAccess}
                                fetchAllData={state.fetchAllData}
                            />
                        }
                    />
                    <Route
                        exact
                        path='/:guild([0-9]{5,19})'
                        render={(props: any) =>
                            <Landing {...props}
                                lookupGuild={state.lookupGuild}
                            />
                        }
                    />
                    <Route path='*' render={() => <Redirect to='/denied' />} />
                </Switch>
            )
        }
    }

    return (
        <div className='content'>
            <div className='content-area'>
                <div className='page'>
                    {route()}
                </div>
            </div>
        </div>
    )
}

export default App;