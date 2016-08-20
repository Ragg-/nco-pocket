// var NsenChannels, NsenEventProxy, _;

import * as _ from "lodash";

const NsenChannels = require("../NsenChannels");

/**
 * ソケットからのNsenのStreamに対するリクエストをプロクシするやつ
 */
export default class NsenEventProxy {
    constructor(_socket) {
        this._socket = _socket;
        this._activeStream = null;
    }

    setSession(_session) {
        this._session = _session;
    }

    handlingCommands() {
        return {
            "nsen/command/change-channel": async(arg) => {
                const channelId = arg.channelId;

                if (this._session == null) {
                    return {
                        success: false,
                        message: "Session not establishment"
                    };
                }

                if (_.select(NsenChannels, {
                        id: channelId
                    }).length === 0) {
                    return {
                        success: false,
                        message: "Invalid channelId " + channelId
                    };
                }

                if ((this._activeStream != null) && (("nsen/" + (this._activeStream.getChannelType())) === channelId)) {
                    return {
                        success: true
                    };
                }

                const defer = Promise.defer();
                if ((ref = this._activeStream) != null) {
                    ref.dispose();
                }

                try {
                    const channel = await this._session.live.getNsenChannelHandlerFor(channelId); //.then(function(channel) {

                    defer.resolve({
                        success: true
                    });

                    this._activeStream = channel;
                    this._bindEventProxy(channel);
                    this._activeStream.fetch();

                    await this._activeStream.connect();

                    var movie;
                    movie = this._activeStream.getCurrentVideo();

                    return app.command.dispatch("service:encoder:prepare", movie);
                } catch (e) {
                    console.error("\u001b[31m[ClientHandler(cmd : nsen/command/change-channel)]", e.stack, "\u001b[m");

                    return {
                        success: false,
                        message: e.message
                    };
                }

                return defer.promise;
            },
            "nsen/command/fetch-live-info": async() => {
                if (this._activeStream == null) {
                    return {
                        success: false
                    };
                }

                await this._activeStream.fetch();
                return {
                    success: true
                };
            },
            "nsen/command/post-comment": async({command, comment}) => {
                try {
                    if (this._activeStream == null) {
                        return {
                            success: false,
                            message: "Stream inactive"
                        };
                    }

                    await this._activeStream.postComment(comment, command);

                    return Promise.resolve({
                        success: true
                    });
                } catch (e) {
                    return {
                        success: false
                    };
                }
            },
            "nsen/command/push-skip": async () => {
                if (this._activeStream == null) {
                    return {
                        success: false,
                        message: "Stream inactive"
                    };
                }

                await this._activeStream.pushSkip()

                return {
                    success: true
                };
            },
            "nsen/command/push-good": async () => {
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
            },
            "nsen/command/push-request": async () => {
                if (this._activeStream == null) {
                    return {
                        success: false,
                        message: "Stream inactive"
                    };
                }

                await this._activeStream.pushRequest();

                return {
                    success: true
                }
            }
        };
    }

    _bindEventProxy(channel) {
        channel.onDidProcessFirstResponse((comments) => {
            this._socket.emit("nsen/event/did-process-first-response", comments);
        });
        channel.getLiveInfo().onDidRefresh(() => {
            const live = channel.getLiveInfo().get();
            this._socket.emit("nsen/event/did-refresh-live-info", live);
        });
        channel.onDidReceiveComment((comment) => {
            this._socket.emit("nsen/event/did-receive-comment", comment);
        });
        channel.onDidChangeMovie((movie, prevMovie) => {
            movie = movie != null ? movie.get() : null;
            prevMovie = prevMovie != null ? prevMovie.get() : null;

            this._socket.emit("nsen/event/did-change-movie", {previous: prevMovie, current: movie});
        });
        channel.onDidReceiveGood(() => {
            this._socket.emit("nsen/event/did-receive-good");
        });
        channel.onWillChangeMovie((movie) => {
            app.command.dispatch("service:encoder:prepare", movie);
        });
    }

    dispose() {
        super.dispose();
        this._socket = null;
    }
}
