import * as _ from "lodash";
import * as Nico from "node-nicovideo-api";

Emitter = require("./utils/Emitter");



NsenChannels = require("./NsenChannels");

// Thresholder = require("./utils/Thresholder.coffee");

export default class ClientHandler extends Emitter {
    _socket = null;
    _session = null;
    _activeStream = null;

    constructor(_socket) {
        super();

        this._socket = _socket;
        this._session = null;

        this._socket.on("disconnect", () => { _this.emit("did-disconnect"); });
        this._handleSocketCommands();
        this._handleLoginEvents();
        this._handleSocketEvents();
    }

    _handleLoginEvents() {
        const loginHandler = async ({user, pass, sessionId}) => {

        const makeSessionPromise = sessionId != null ? Nico.restoreFromSessionId(sessionId) : Nico.login(user, pass);
        _this._session = await makeSessionPromise;

        try {
            const active = sessionId != null ? await _this._session.isActive() : true;

            if (active) {
                _this._socket.emit("did-login", {
                    sessionId: _this._session.sessionId
                });
            } else {
                _this._socket.emit("require-login", {
                    message: "セッション期限が切れました。"
                });
            }
        } catch (e) {
            _this._socket.emit("require-login", {
                message: "IDかパスワードが間違っています。"
            });
        };

        this._socket.on("try-login", loginHandler);
    }

    _handleSocketCommands() {
        const getUserInfoWorkers = new Thresholder({
            maxParallels: 1,
            delay: 100
        });

        this.onDidDisconnect(() => {
            getUserInfoWorkers.stop();
            getUserInfoWorkers = null;
        });

        this._commands = {
            "nico:user:getUserInfo": ({userId}) => {
                var defer = Promise.defer();

                getUserInfoWorkers.que(async () => {
                    const user = await _this._session.user.getUserInfo(userId);
                    defer.resolve({user: user.get()});
                });

                return defer.promise;
            },
            "nsen:change-channel": async (arg) => {
                // var channelId, e, error, ref;
                const channelId = arg.channelId;

                try {
                    if (_this._session == null) {
                        return Promise.resolve({
                            success: true
                        });
                    }

                    if (_.select(NsenChannels, {id: channelId}).length === 0) {
                        return {
                            success: false
                        };
                    }

                    if ((_this._activeStream != null) && (("nsen/" + (_this._activeStream.getChannelType())) === channelId)) {
                        return {
                            success: true
                        };
                    }
                    if ((ref = _this._activeStream) != null) {
                        ref.dispose();
                    }

                    const channel = async _this._session.live.getNsenChannelHandlerFor(channelId);

                    _this._activeStream = channel;
                    _this._handleChannelEvents(channel);
                    await _this._activeStream.fetch();

                    _this._activeStream.getCurrentVideo();
                    app.command.dispatch("service:encoder:prepare", movie);

                    return {
                        success: true
                    };
                } catch (error) {
                    console.error("[ClientHandler(cmd : nsen:change-channel)]", e);
                    throw error;
                }
            },
            "nsen:push-good": async () {
                var e, error;
                try {
                    if (this._activeStream == null) {
                        return {
                            success: false,
                            message: "Stream inactive"
                        };
                    }

                    await this._activeStream.pushGood();
                    return {
                        success: true
                    };
                } catch (error) {
                    throw error;
                }
            },
            "nsen:push-request": function() {
                var e, error;
                try {
                    if (this._activeStream == null) {
                        return Promise.resolve({
                            success: false,
                            message: "Stream inactive"
                        });
                    }
                    return this._activeStream.pushRequest().then(function() {
                        return Promise.resolve({
                            success: true
                        });
                    });
                } catch (error) {
                    throw error;
                }
            },
            "nsen:post-comment": (function(_this) {
                return function(arg) {
                    var command, comment, e, error;
                    comment = arg.comment, command = arg.command;
                    try {
                        if (_this._activeStream == null) {
                            return Promise.resolve({
                                success: false,
                                message: "Stream inactive"
                            });
                        }
                        return _this._activeStream.postComment(comment, command).then(function() {
                            return Promise.resolve({
                                success: true
                            });
                        })["catch"](function(e) {
                            return Promise.resolve({
                                success: false
                            });
                        });
                    } catch (error) {
                        e = error;
                        return Promise.reject(e);
                    }
                };
            })(this)
        };
    }

    _handleSocketEvents() {
        return this._socket.on("command:request", async (arg) => {
            const commandId = arg.commandId;
            const command = arg.command;
            const options = arg.options;

            if (_this._commands[command] == null) {
                return;
            }

            try {
                const result = await _this._commands[command](options);
                return _this._socket.emit("command:response", {
                    commandId: commandId,
                    result: result
                });
            } catch (e) {
                console.error("\u001b[31m[ClientHandler] failed to execute command '" + command + "'. (" + e.message + ")");
            };
        }
    }

    _handleChannelEvents(channel) {
        channel.getLiveInfo().onDidRefresh(() => {
            const live = channel.getLiveInfo().get();
            _this._socket.emit("nsen/did-refresh-live-info", live);
        });

        channel.onDidReceiveComment((comment) => {
            return _this._socket.emit("nsen/did-receive-comment", comment);
        });

        channel.onDidChangeMovie((movie, prevMovie) => {
            const movie = movie.get();
            const prevMovie = prevMovie.get();

            this._socket.emit("nsen/did-change-movie", {
                previous: prevMovie,
                current: movie
            });
        });
        channel.onDidReceiveGood(() => {
            this._socket.emit("nsen/did-receive-good");
        });
        channel.onDidProcessFirstResponse((comments) => {
            _this._socket.emit("nsen/did-process-first-response", comments);
        });
        channel.onWillChangeMovie((movie) => {
            app.command.dispatch("service:encoder:prepare", movie);
        });
    }

    _heartbeat() {
        this._hbTick = setInterval(() => {
            const timeoutId = setTimeout(() => {
                _this._socket.disconnect();
            }, 10000);

            this._socket.once("heartbeat", () => { clearTimeout(timeoutId); });
            this._socket.emit("heartbeat");
        });
    }

    onDidDisconnect(listener) {
        this.on("did-disconnect", listener);
    }
}
