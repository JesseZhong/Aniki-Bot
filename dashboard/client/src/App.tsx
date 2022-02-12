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


const GUILD_ID_PATTERN = ':guild([0-9]{5,19})';
const GUILD_VANITY_PATTERN = ':vanity([a-zA-Z0-9_]{2,100})';


const App = (state: AppState) => {

    const route = () => {
        if (state.session?.access_token) {
            return (
                <Routes>
                    <Route path='/nope' element={PageNotFound} />
                    <Route path='/g'>
                        <Route
                            path={GUILD_VANITY_PATTERN}
                            element={<VanityLayout session={state.session} />}
                        >
                            <Route
                                path='/home'
                                element={
                                    <MainPage
                                        personas={state.personas}
                                        reactions={state.reactions}
                                    />
                                }
                            />
                            <Route index element={<Navigate replace to='home' />} />
                        </Route>
                        <Route index element={<Navigate replace to='/nope' />} />
                    </Route>
                    <Route
                        path='/'
                        element={<GuildLayout session={state.session} />}
                    >
                        <Route path={GUILD_ID_PATTERN}>
                        </Route>
                        <Route
                            index
                            element={<Navigate replace to='/nope' />}
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
                        element={Denied}
                    />
                    <Route
                        path='/requestauth'
                        element={<RequestAuthorization session={state.session}/>}
                    />
                    <Route
                        path='/authorized'
                        element={<FetchingAccess session={state.session}/>}
                    />
                    <Route path='/g'>
                        <Route path={GUILD_VANITY_PATTERN}>
                            <Route path='/home' element={<Navigate replace to='/requestauth' />} />
                            <Route index element={<Navigate replace to='/requestauth' />} />
                        </Route>
                        <Route index element={<Navigate replace to='/denied' />} />
                    </Route>
                    <Route path='/'>
                        <Route path={GUILD_ID_PATTERN}>
                            <Route path='/home' element={<Navigate replace to='/requestauth' />} />
                            <Route index element={<Navigate replace to='/requestauth' />} />
                        </Route>
                        <Route
                            index
                            element={<Navigate replace to='/denied' />}
                        />
                    </Route>
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