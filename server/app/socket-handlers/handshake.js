export default function* () {
    const nicoSession = app.sessionStore[this.cookies.get('nco-authenticate-id')];
    if (!nicoSession) { return; }

    nicoSession.socket = this;
    this.emit(SocketEventTypes.NCO_HANDSHAKE_RESPONSE, {});
};
