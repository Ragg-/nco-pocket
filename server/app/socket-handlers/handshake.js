import SocketEventTypes from '../../../shared/SocketEventTypes';
import NsenChannelToSocketConnector from '../utils/nsen-channel-to-socket-connector';

export default function* (err, {authenticateId} = {}) {
    const nicoSession = app.sessionStore[authenticateId || this.cookies.get('nco-authenticate-id')];

    if (!nicoSession) {
        this.emit(SocketEventTypes.NCO_HANDSHAKE_RESPONSE, {
            success: false,
        });
        return;
    }

    if (nicoSession.channel) {
        NsenChannelToSocketConnector.connect(this, nicoSession.channel);
    }

    nicoSession.socket = this;
    this.emit(SocketEventTypes.NCO_HANDSHAKE_RESPONSE, {success: true});
};
