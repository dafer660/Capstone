import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import {Auth0Provider} from "@auth0/auth0-react";

import './index.css';
import App from './App';

ReactDOM.render(
    <Auth0Provider
        domain="ferreiratech.eu.auth0.com"
        clientId="4dNGxe7ibww71BoxWxeh1qjTD7Eb2FNV"
        redirectUri={window.location.origin}
        audience={"ferreiratech"}>
        <App/>
    </Auth0Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
