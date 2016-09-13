import querystring from 'querystring';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

import NcoSessionManager from '../managers/nco-session-manager';
import SocketEventTypes from '../../../shared/SocketEventTypes';

export default {
    [Symbol.toStringTag]: 'NcoActionCreators',

    /**
     * @param {string} payload.channel
     */
    async ncoChangeChannel(payload)
    {
        const query = querystring.stringify({channel: payload.channel});
        const response = await (await fetch(`/api/nsen/change-channel?${query}`, {
            method: 'get',
            credentials: 'same-origin'
        })).json();

        Dispatcher.dispatch({
            actionType: Actions.NCO_CHANNGE_CHANNEL,
            payload,
        });
    },

    ncoPreferenceOpen()
    {
        Dispatcher.dispatch({
            actionType: Actions.NCO_PREFERENCE_OPEN,
        });
    },

    ncoPreferenceClose()
    {
        Dispatcher.dispatch({
            actionType: Actions.NCO_PREFERENCE_CLOSE,
        });
    },

    /**
     * @param {Object} options
     * @param {boolean} options.playerEnabled?
     */
    ncoPreferenceSave(options)
    {
        Dispatcher.dispatch({
            actionType: Actions.NCO_PREFERENCE_SAVE,
            payload: options
        });
    },

    async ncoMylistIndexFetch()
    {
        Dispatcher.dispatch({actionType: Actions.NCO_MYLIST_FETCH_START});

        const response = await (await fetch('/api/mylist-index', {
            credentials: 'same-origin',
        })).json();

        Dispatcher.dispatch({
            actionType: Actions.NCO_MYLIST_INDEX_FETCHED,
            payload: {
                list: response.list
            },
        });
    },

    async ncoMylistItemsFetch(mylistId)
    {
        Dispatcher.dispatch({actionType: Actions.NCO_MYLIST_FETCH_START});

        const response = await (await fetch(`/api/mylist-items/${encodeURIComponent(mylistId)}`, {
            credentials: 'same-origin',
        })).json();

        Dispatcher.dispatch({
            actionType: Actions.NCO_MYLIST_ITEMS_FETCHED,
            payload: {
                mylistId,
                items: response.items,
            },
        });
    },

    /**
     * @param {boolean} payload.connected
     */
    ncoNetworkStateChanged(payload)
    {
        Dispatcher.dispatch({
            actionType: Actions.NCO_NETWORK_STATE_CHANGED,
            payload,
        });
    },

    async ncoAuthCheckAndUpdateStatus()
    {
        const response = await (await fetch('/api/auth?check', {method: 'get', credentials: 'same-origin'})).json();

        if (response.authenticated) {
            NcoSessionManager.socket.emit(SocketEventTypes.NCO_HANDSHAKE);
        }

        Dispatcher.dispatch({
            actionType: Actions.NCO_AUTH_UPDATE_STATUS,
            payload: {
                logged: response.authenticated,
            },
        });
    },

    /**
     * @param {string} payload.email
     * @param {string} payload.password
     */
    async ncoAuthRequest({email, password, channel})
    {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('channel', channel);

        const response = await (await fetch('/api/auth', {
            method: 'post',
            credentials: 'same-origin',
            body: formData,
        })).json();

        if (response.authenticated) {
            NcoSessionManager.socket.emit(SocketEventTypes.NCO_HANDSHAKE, {
                authenticateId: response.authenticateId
            });
        }

        Dispatcher.dispatch({
            actionType: Actions.NCO_AUTH_UPDATE_STATUS,
            payload: {
                logged: response.authenticated,
                failedReason: response.reason,
            },
        });
    },
}
