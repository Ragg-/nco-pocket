import immutable from 'immutable';
import Emitter from '../utils/emitter';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';
import SocketMessageTypes from '../../../shared/SocketMessageTypes';

import CommentPayloadStruct from '../structs/comment';

import NcoSessionManager from '../managers/nco-session-manager';

const _emitter = new Emitter();
let _comments = immutable.List([]);

const CommentUser = immutable.Record({
    id: null,
    score: null,
    accountType: null,
    isPremium: false,
    isAnonymous: null,
});
const Comment = immutable.Record({
    threadId: null,
    date: null,
    locale: null,
    command: null,
    comment: null,
    isMyPost: null,
    user: CommentUser(),
});

function transformComment(payload) {
    return {
        isControl: payload.is
    }
    // return comment.set('comment', comment.comment.replace(/(https?:\/\/[^\s　<>]+)/g, '<a href='$&'>$&</a>'))
}

export default class CommentsStore
{
    static init()
    {
        NcoSessionManager.socket.on(SocketMessageTypes.SOCKET_RECEIVE_COMMENT, payload => {
            payload.user = CommentUser(payload.user);

            const comment = Comment(payload);
            _comments = _comments.push(comment);
            console.log(_comments);
            _emitter.emit('change');
        });

        Dispatcher.on(Actions.NSEN_SEND_COMMENT, payload => {
            NcoSessionManager.socket.emit(SocketMessageTypes.SOCKET_NSEN_SEND_COMMENT, payload);
        });

        Dispatcher.on(Actions.NSEN_CHANGE_CHANNEL, payload => {
            _comments = _comments.clear();
            _emitter.emit('change');
        });
    }

    static observe(callback)
    {
        return _emitter.on('change', callback);
    }

    static getComments()
    {
        return _comments;
    }
}
