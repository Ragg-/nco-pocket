import * as _ from "lodash";
import DisposableEmitter from "disposable-emitter";
import * as Nico from "node-nicovideo-api";

const Thresholder = require("../utils/Thresholder");
const NsenProxy = require("./NsenProxy");

export default class Client extends DisposableEmitter {
    // _socket = null;
    // _session = null;
    // _activeStream = null;

    constructor(_socket) {
        super();

        this._socket = _socket;

        this._session = null;
        this._nsenProxy = new NsenProxy(this._socket);
        this._commands = {};

        this._socket.on("disconnect", () => {
            this.emit("did-disconnect");
            this.dispose();
        });

        this._handleSocketCommands();
        this._handleLoginEvents();
        this._handleSocketEvents();
    }

    async _handleLoginEvents() {
        this._socket.on("try-login", async ({user, pass, sessionId}) => {
            // const user = arg.user;
            // const pass = arg.pass;
            // const sessionId = arg.sessionId;
            var active;
            var promise = sessionId != null ? Nico.restoreFromSessionId(sessionId) : Nico.login(user, pass);

            this._session = await promise;

            try {
                if (sessionId != null) {
                    active = await this._session.isActive();
                } else {
                    active = true;
                }

                if (active) {
                    this._socket.emit("did-login", {
                        sessionId: this._session.sessionId
                    });
                    this._nsenProxy.setSession(this._session);
                    this.emit("did-login");
                } else {
                    this._socket.emit("require-login", {
                        message: "セッション期限が切れました。"
                    });
                }
            }
            catch (e) {
                this._socket.emit("require-login", {
                    message: "IDかパスワードが間違っています。"
                });
            }
        });
    }

    _handleSocketCommands() {
        var getUserInfoWorkers = new Thresholder({
            maxParallels: 1,
            delay: 100
        });

        this.onDidDisconnect(() => {
            getUserInfoWorkers.stop();
            getUserInfoWorkers = null;
        });

        _.assign(this._commands, {
            "nico:user:getUserInfo": (arg) => {
                // var defer, userId;
                const userId = arg.userId;
                const defer = Promise.defer();

                getUserInfoWorkers.que(async () =>{
                    const user = await this._session.user.getUserInfo(userId);
                    defer.resolve({user: user.get()});
                });

                return defer.promise;
            }
        }, this._nsenProxy.handlingCommands());
    }

    _handleSocketEvents() {
        this._socket.on("command:request", async (arg) => {
            const commandId = arg.commandId;
            const command = arg.command;
            const options = arg.options;

            if (this._commands[command] == null) {
                return;
            }

            try {
                const result = await this._commands[command](options);
                this._socket.emit("command:response", {commandId, result});
            } catch (e) {
                console.error("\u001b[31m[ClientHandler] failed to execute command '" + command + "'. (" + e.message + ")");
                this._socket.emit("command:reject-response", {commandId, error: e.message});
            }
        });
    }

    _heartbeat() {
        this._hbTick = setInterval(() => {
            const timeoutId = setTimeout(() => { _this._socket.disconnect(); }, 10000);
            this._socket.once("heartbeat", () => { clearTimeout(timeoutId); });
            this._socket.emit("heartbeat");
        });
    }

    onDidDisconnect(listener) {
        this.on("did-disconnect", listener);
    }
}
