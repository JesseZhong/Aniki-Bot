import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppState } from './containers/AppContainer';
import FetchingAccess from './auth/FetchingAccess';
import RequestAuthorization from './auth/RequestAuth';
import PageNotFound from './not-found/PageNotFound';
import MainPage from './main/MainPage';
import Denied from './auth/Denied';
import VanityLayout from './main/VanityLayout';
import GuildLayout from './main/GuildLayout';
import SessionActions from './actions/SessionActions';


SessionActions.load();

const App = (state: AppState) => {

    const route = () => {
        if (state.session?.access_token) {
            return (
                <Routes>
                    <Route path='/nope' element={<PageNotFound />} />
                    <Route
                        path={`/g/:vanity`}
                        element={<VanityLayout session={state.session} guild={state.guild} />}
                    >
                        <Route
                            index
                            element={
                                <MainPage
                                    guild={state.guild}
                                    personas={state.personas}
                                    reactions={state.reactions}
                                />
                            }
                        />
                    </Route>
                    <Route
                        path={`/:guild`}
                        element={<GuildLayout session={state.session} guild={state.guild} />}
                    >
                        <Route
                            index
                            element={
                                <MainPage
                                    guild={state.guild}
                                    personas={state.personas}
                                    reactions={state.reactions}
                                />
                            }
                        />
                    </Route>
                    <Route path='*' element={<Navigate replace to='/nope' />} />
                </Routes>
            )
        }

        else {
            return (
                <Routes>
                    <Route
                        path='/denied'
                        element={<Denied />}
                    />
                    <Route
                        path='/authorized'
                        element={<FetchingAccess session={state.session}/>}
                    />
                    <Route path={`/g/:vanity`} element={<RequestAuthorization session={state.session}/>} />
                    <Route path={`/:guild`} element={<RequestAuthorization session={state.session}/>} />
                    <Route path='*' element={<Navigate replace to='/denied' />} />
                </Routes>
            );
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