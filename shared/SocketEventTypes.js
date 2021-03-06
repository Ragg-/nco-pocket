export default {
    /** Client To Server **/
    NCO_HANDSHAKE: 'nco:handshake',

    // @param {comment: string, anony: boolean}
    SOCKET_NSEN_SEND_COMMENT: 'nsen:send-comment',


    /** Server To Client **/
    NCO_HANDSHAKE_RESPONSE: 'nco:handshake-response',

    // @param NicoLiveComment
    SOCKET_RECEIVE_FIRST_RESPONSE_COMMENTS: 'nsen:receive-first-response-comments',
    SOCKET_RECEIVE_COMMENT: 'nsen:receive-comment',
    SOCKET_RECEIVE_GOOD: 'nsen:receive-good',
    SOCKET_RECEIVE_ADD_MYLIST: 'nsen:receive-add-mylist',
};
