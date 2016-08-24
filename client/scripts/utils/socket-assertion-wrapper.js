import io from 'thirdparty/socket.io';
import SocketEventTypes from '../../../shared/SocketEventTypes';
const _messageTypes = Object.values(SocketEventTypes).concat([
    'connect', 'connect_error', 'error', 'disconnect', 'reconnect', 'reconnect_attempt',
    'reconnecting', 'reconnect_error', 'reconnect_failed',
]);

function _emit(...args)
{
    const [type] = args;
    assertMessageType(type);
    io.Socket.prototype.emit.apply(this, args);
}

function _on(...args)
{
    const [type] = args;
    assertMessageType(type);
    io.Socket.prototype.on.apply(this, args);
}

export function assertMessageType(type)
{
    if (! _messageTypes.includes(type)) {
        throw new Error(`Socket message type '${type}' does not defined.`);
    }
}

export default class SocketAssertionWrapper
{
    static wrap(socket)
    {
        socket.emit = _emit;
        socket.on = _on;
        return socket;
    }
}
