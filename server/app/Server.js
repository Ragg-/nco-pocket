"use strict";

import connectStream from 'connect-stream';
import Emitter from 'disposable-emitter';

import Koa from 'koa.io';
import koaStatic from 'koa-static';
import koaRoute from 'koa-route';
import koaGenericSession from 'koa-generic-session';
import koaSessionRedisStore from 'koa-redis';
import koaBodyParser from "koa-better-body";

import * as fs from 'fs';
import * as Nico from 'node-nicovideo-api';
import * as path from 'path';

import SocketEventTypes from '../../shared/SocketEventTypes';

export default class Server
{
    static async start(config)
    {
        const app = global.app = {};
        // const
        app.sessionStore = {};

        const koa = app.koa = Koa();
        koa.keys = config.cookie.keys;
        koa.use(koaBodyParser({fields: true}));
        koa.use(koaStatic(path.join(__dirname, '../../tmp/client/')));
        koa.use(koaGenericSession({store: koaSessionRedisStore()}));
        koa.use(function* (next) {
            this.nicoSession = app.sessionStore[this.cookies.get('nco-authenticate-id')];
            yield* next;
        });

        // Handle stream access
        koa.use(koaRoute.get('/stream/:channel',                require('./controller/stream')));
        koa.use(koaRoute.get('/api/auth',                       require('./controller/api/auth')));
        koa.use(koaRoute.post('/api/auth',                      require('./controller/api/auth')));
        koa.use(koaRoute.get('/api/mylist-index',               require('./controller/api/mylist-index')));
        koa.use(koaRoute.get('/api/mylist-items/:mylistId',     require('./controller/api/mylist-items')));
        koa.use(koaRoute.post('/api/nsen/comment',              require('./controller/api/nsen/comment')));
        koa.use(koaRoute.get('/api/user/:userId',               require('./controller/api/user')));

        koa.io.use(function* (next) {
            console.log('\u001b[36mNew client \u001b[32mconnected\u001b[m');
            yield* next;
            console.log('\u001b[36mClient \u001b[31mdisconnected.\u001b[m');
        });

        koa.io.route(SocketEventTypes.HANDSHAKE,            require("./socket-handlers/handshake"));

        koa.listen(config.port);
        console.log(`\u001b[36mServer listen on ${config.port}\u001b[m`);
    }
}
