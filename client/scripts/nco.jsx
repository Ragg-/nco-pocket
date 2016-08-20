import Promise from 'es6-promise';
// import jQuery from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';
import 'thirdparty/jquery.powertip';
import 'fetch';
import 'es6-collections';

import Dispatcher from './app/dispatcher.js';
import Actions from './const/Actions';
import NcoSessionManager from './managers/nco-session-manager';

import PreferenceStore from './stores/preference-store';
import AuthStore from './stores/auth-store';
import CommentsStore from './stores/comments-store';

import RootView from './views/root';

window.app = {Dispatcher, PreferenceStore};
window.Promise || (window.Promise = Promise);
window.Promise.defer = () => {
    const defer = {};

    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });

    return defer;
};

// expose
// window.React = React;
// window.immutable = require("immutable");
// window.$ = window.jQuery = jQuery;

document.addEventListener('DOMContentLoaded', () => {
    PreferenceStore.init(Dispatcher);
    AuthStore.init(Dispatcher);
    CommentsStore.init();

    setTimeout(() => Dispatcher.dispatch(Actions.NCO_REQUEST_CHECK_AND_UPDATE_AUTH_STATUS), 200);

    ReactDOM.render(<RootView />, document.querySelector('#nco-root'));
});
