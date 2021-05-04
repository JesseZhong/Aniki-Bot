import React from 'react';
import { render } from 'react-dom';
import AppContainer from './containers/AppContainer';
import { BrowserRouter } from 'react-router-dom';
import './index.sass';

render(
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>,
  document.getElementById('root')
);