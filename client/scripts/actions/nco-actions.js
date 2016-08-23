import Dispatcher from '../app/dispatcher';

import Actions from '../const/Actions';

import AuthStore from '../stores/auth-store';
import CommentsStore from '../stores/comments-store';
import PreferenceStore from '../stores/preference-store.js';

export default {
    [Symbol.toStringTag]: 'NcoActionCreators',

    /**
     * @param string payload.channel
     */
    nsenChangeChannel(payload)
    {
        Dispatcher.dispatch(Actions.NSEN_CHANGE_CHANNEL, payload);
    },

    /**
     * @param string payload.comment
     * @param boolean payload.anony
     */
    nsenSendComment(payload)
    {
        Dispatcher.dispatch(Actions.NSEN_SEND_COMMENT, payload);
    },

    ncoPreferenceOpen()
    {
        Dispatcher.dispatch(Actions.NCO_PREFERENCE_OPEN);
    },

    ncoPreferenceClose()
    {
        Dispatcher.dispatch(Actions.NCO_PREFERENCE_CLOSE);
    },

    /**
     * @param boolean payload.playerEnabled
     */
    ncoUpdatePreference(payload)
    {
        Dispatcher.dispatch(Actions.NCO_UPDATE_PREFERENCE, payload);
    },

    /**
     * @param boolean payload.connected
     */
    ncoNetworkStateChanged(payload)
    {
        Dispatcher.dispatch(Actions.NCO_NETWORK_STATE_CHANGED, payload);
    },

    ncoAuthCheckAndUpdateStatus()
    {
        Dispatcher.dispatch(Actions.NCO_AUTH_CHECK_AND_UPDATE_STATUS);
    },

    /**
     * @param string payload.email
     * @param string payload.password
     */
    ncoAuthRequest(payload)
    {
        Dispatcher.dispatch(Actions.NCO_AUTH_REQUEST, payload);
    },
}
