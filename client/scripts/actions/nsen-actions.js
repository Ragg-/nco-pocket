import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

import SocketEventTypes from '../../../shared/SocketEventTypes';
import Comment from '../struct/comment';


export default {
    [Symbol.toStringTag]: 'NsenActionCreators',

    attachSocket(socket)
    {
        socket.on(SocketEventTypes.SOCKET_RECEIVE_COMMENT, comment => {
            Dispatcher.dispatch({
                actionType: Actions.NSEN_RECEIVE_COMMENT,
                payload: {
                    comment: Comment.fromJSON(comment),
                },
            });
        });
    },

    /**
     * @param {string} payload.comment
     * @param {boolean} payload.anony
     */
    async nsenSendComment({comment, anony})
    {
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('anony', anony);

        const response = await (await fetch('/api/nsen/comment', {
            method: 'post',
            credentials: 'same-origin',
            body: formData,
        })).json();
    },
};
