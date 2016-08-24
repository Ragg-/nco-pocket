import * as uuid from 'node-uuid';
import * as NicoVideoAPI from 'node-nicovideo-api';

import NsenChannels from '../../../../shared/NsenChannels';

const channelIds = Object.values(NsenChannels).map(channel => channel.id);

export default function* auth()
{
    if (this.method === 'GET' && this.querystring === 'check') {
        yield* authCheck.call(this);
        return;
    }

    if (this.req.method === 'POST') {
        yield* authAuthenticate.call(this);
        return;
    }

    this.status = 405;
}


function* authCheck() {
    const ncoSessionId = this.cookies.get('nco-authenticate-id');
    this.body = {authenticated: !!ncoSessionId && !!app.sessionStore[ncoSessionId]};
    return;
}

function* authAuthenticate() {
    const nicoSession = {};
    const {email, password} = this.request.fields;
    let {channel} = this.request.fields;

    if (channel !== '' && ! channelIds.includes(channel)) {
        this.body = {
            success: false,
            reason: 'チャンネルIDが正しくありません。',
        }
        return;
    }

    channel = channel === '' ? null : channel;

    try {
        let session = nicoSession.session = yield NicoVideoAPI.login(email, password);
        nicoSession.channel = yield session.live.getNsenChannelHandlerFor(channel || 'nsen/vocaloid', {
            connect: true,
            firstGetComments: 200,
        });
    } catch (e) {
        this.body = {authenticated: false};
        console.error(e);
        return;
    }

    let ncoAuthenticateId = uuid.v4();
    while (app.sessionStore[ncoAuthenticateId]) { ncoAuthenticateId = uuid.v4(); }

    app.sessionStore[ncoAuthenticateId] = nicoSession;
    this.cookies.set('nco-authenticate-id', ncoAuthenticateId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        signed: true,
        path: '/',
        httpOnly: true,
    });

    this.body = {
        authenticated: true,
        authenticateId: ncoAuthenticateId,
    };
}
