export default {
    /** Client To Server **/
    NCO_HANDSHAKE: 'nco:handshake',

    // @param {comment: string, anony: boolean}
    SOCKET_NSEN_SEND_COMMENT: 'nsen:send-comment',


    /** Server To Client **/
    NCO_HANDSHAKE_RESPONSE: 'nco:handshake-response',

    // @param NicoLiveComment
    SOCKET_RECEIVE_COMMENT: 'nsen:receive-comment',
};
