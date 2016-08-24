import SocketEventTypes from '../../../shared/SocketEventTypes';

export default class NsenChannelToSocketConnector
{
    static _disposers = new WeakMap();

    static connect(socket, channel)
    {
        // channel.onDidReceiveComment(comment => {
        //     socket.emit(SocketEventTypes.SOCKET_RECEIVE_COMMENT, comment);
        // });
        channel.onDidReceiveComment(comment => {
            socket.emit(SocketEventTypes.SOCKET_RECEIVE_COMMENT, comment.get());
        });

        NsenChannelToSocketConnector._disposers.set(socket, [
            channel.onDidReceiveComment(comment => {
                socket.emit(SocketEventTypes.SOCKET_RECEIVE_COMMENT, comment.get());
            }),
            channel.onDidReceiveGood(_ => {
                console.log('onDidReceiveGood');
                socket.emit(SocketEventTypes.SOCKET_RECEIVE_COMMENT);
            }),
            channel.onDidReceiveAddMylist(_ => {
                console.log('onDidReceiveAddMylist');
                socket.emit(SocketEventTypes.SOCKET_RECEIVE_ADD_MYLIST);
            }),
            channel.onWillDispose(_ => {
                NsenChannelToSocketConnector.disconnect(socket);
                channel = null;
                socket = null;
            }),
        ]);
    }

    static disconnect(socket)
    {
        const disposers = NsenChannelToSocketConnector._disposers.get(socket);

        if (!disposers) { return; }
        disposers.forEach(disposer => disposer.dispose());
    }
}
