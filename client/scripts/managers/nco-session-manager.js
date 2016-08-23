import io from 'thirdparty/socket.io';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

import SocketEventTypes from '../../../shared/SocketEventTypes';
import SocketAssertionWrapper from '../utils/socket-assertion-wrapper';

export default new class NcoSessionManager
{
    constructor() {
        window.socket = this._socket = SocketAssertionWrapper.wrap(io(`ws://${location.host}`));

        this.socket.once(SocketEventTypes.NCO_HANDSHAKE_RESPONSE, payload => {
            return;
        });

        this.socket.emit(SocketEventTypes.NCO_HANDSHAKE);
    }

    get socket()
    {
        return this._socket;
    }
}
