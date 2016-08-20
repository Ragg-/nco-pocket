import keyMirror from "key-mirror";

export default keyMirror({
    // @param {channel: string}
    NSEN_CHANGE_CHANNEL: null,

    // @param {comment: string, anony: boolean}
    NSEN_SEND_COMMENT: null,

    // @param void
    NCO_PREFERENCE_OPEN: null,
    // @param void
    NCO_PREFERENCE_CLOSE: null,

    // @param {playerEnabled: boolean}
    NCO_UPDATE_PREFERENCE: null,

    // @param {connected: boolean}
    NCO_NETWORK_STATE_CHANGED: null,

    // Authentication Actions
    // @param void
    NCO_REQUEST_CHECK_AND_UPDATE_AUTH_STATUS: null,

    // @param void
    NCO_NEED_AUTHENTICATION_INFO: null,

    // @param {email: string, password: string}
    NCO_REQUEST_AUTHENTICATION: null,

    // @param void
    NCO_AUTHENTICATION_FAILED: null,
});
