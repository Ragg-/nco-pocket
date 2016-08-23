import * as uuid from 'node-uuid';
import * as NicoVideoAPI from 'node-nicovideo-api';

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
    let nicoSession;
    const {email, password} = this.request.fields;

    try {
        nicoSession = yield NicoVideoAPI.login(email, password);
    } catch (e) {
        this.body = {authenticated: false};
        return;
    }

    let ncoSessionId = uuid.v4();
    while (app.sessionStore[ncoSessionId]) { ncoSessionId = uuid.v4(); }

    app.sessionStore[ncoSessionId] = nicoSession;
    this.cookies.set('nco-authenticate-id', ncoSessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        signed: true,
        path: '/',
        httpOnly: true,
    });

    this.body = {authenticated: true};
}
