import SocketEventTypes from '../../../shared/SocketEventTypes';

export default class NsenChannelToSocketConnector
{
    static _disposers = new WeakMap();

    static connect(socket, channel)
    {
        NsenChannelToSocketConnector._disposers.set(socket, [
            channel.onDidProcessFirstResponse(comments => {
                // socket.emit(SocketEventTypes.SOCKET_RECEIVE_FIRST_RESPONSE_COMMENTS, comments.map(c => c.get()));
            }),
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
            {dispose: () => console.log(`${socket.id} session disposed`)}
        ]);
    }

    static disconnect(socket)
    {
        const disposers = NsenChannelToSocketConnector._disposers.get(socket);

        if (!disposers) { return; }
        try {
            disposers.forEach(disposer => disposer.dispose());
        } catch (e) {
            throw new Error(`Socket connection dispose failed (${e.message})`);
        }
    }
}
