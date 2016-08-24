import Promise from 'es6-promise';
// import jQuery from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';
import 'thirdparty/jquery.powertip';
import 'fetch';
import 'es6-collections';

import NcoSessionManager from './managers/nco-session-manager';

import NcoActions from './actions/nco-actions';
import NsenActions from './actions/nsen-actions';

import PreferenceStore from './stores/preference-store';
import AuthStore from './stores/auth-store';
import CommentsStore from './stores/comments-store';

import RootView from './views/root';

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
    NsenActions.attachSocket(NcoSessionManager.socket);
    ReactDOM.render(<RootView />, document.querySelector('#nco-root'));
    setTimeout(() => NcoActions.ncoAuthCheckAndUpdateStatus(), 200);
});
