import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

export default {
    [Symbol.toStringTag]: 'NcoActionCreators',

    /**
     * @param {string} payload.channel
     */
    ncoChangeChannel(payload)
    {
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
    ncoUpdatePreference(options)
    {
        Dispatcher.dispatch({
            actionType: Actions.NCO_UPDATE_PREFERENCE,
            payload: options
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
    async ncoAuthRequest({email, password})
    {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await (await fetch('/api/auth', {
            method: 'post',
            credentials: 'same-origin',
            body: formData,
        })).json();

        Dispatcher.dispatch({
            actionType: Actions.NCO_AUTH_UPDATE_STATUS,
            payload: {
                logged: response.authenticated,
                failedReason: response.reason,
            },
        });
    },
}
