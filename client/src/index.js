import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {legacy_createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { GoogleOAuthProvider } from '@react-oauth/google';

import  reducers  from './reducers';
import App from './App';
import './index.css'

const store = legacy_createStore(reducers, compose(applyMiddleware(thunk)));



ReactDOM.render(
  <Provider store={store} >
    <GoogleOAuthProvider clientId="239147542978-mit0h8u4rfkmv62jqtebom32icrujt8u.apps.googleusercontent.com">
      <App/>
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root'),
);