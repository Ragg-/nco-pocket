import keyMirror from "key-mirror";

export default keyMirror({
    NSEN_CHANGE_CHANNEL: null,

    NSEN_SEND_COMMENT: null,

    NCO_PREFERENCE_OPEN: null,
    NCO_PREFERENCE_CLOSE: null,

    NCO_UPDATE_PREFERENCE: null,

    NCO_NETWORK_STATE_CHANGED: null,

    // Authentication Actions
    // @param void
    NCO_AUTH_CHECK_AND_UPDATE_STATUS: null,

    // @param {email: string, password: string}
    NCO_AUTH_REQUEST: null,
});
