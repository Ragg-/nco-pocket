import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';
import SocketEventTypes from '../../../shared/SocketEventTypes';

// const CommentUser = Immutable.Record({
//     id: null,
//     score: null,
//     accountType: null,
//     isPremium: false,
//     isAnonymous: null,
// });
//
// const Comment = Immutable.Record({
//     threadId: null,
//     date: null,
//     locale: null,
//     command: null,
//     comment: null,
//     isMyPost: null,
//     user: CommentUser(),
// });


export default {
    [Symbol.toStringTag]: 'NsenActionCreators',

    attachSocket(socket)
    {
        socket.on(SocketEventTypes.SOCKET_RECEIVE_COMMENT, comment => {
            Dispatcher.dispatch({
                actionType: Actions.NSEN_RECEIVE_COMMENT,
                payload: comment,
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
