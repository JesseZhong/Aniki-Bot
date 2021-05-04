import * as React from 'react';
import { AppState } from "./containers/AppContainer";
import { Switch, Route } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import PersonasPage from './personas/PersonasPage';
import ReactionsPage from './reactions/ReactionsPage';

const App = (state: AppState) => (
    <div className='page'>
        <Switch>
            <Route path='/reactions' render={(props: any) => (
                <ReactionsPage {...props} reactions={state.reactions} />
            )} />
            <Route path='/personas' render={(props: any) => (
                <PersonasPage {...props} personas={state.personas} />
            )} />
            <Route exact path='/' render={(props: any) => (
                <ReactionsPage {...props} reactions={state.reactions} />
            )} />
            <Route path='*' component={PageNotFound} />
        </Switch>
    </div>
)

export default App;