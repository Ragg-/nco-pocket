__          = require "lodash-deep"
{CompositeDisposable, Disposable} = require "event-kit"
Emitter     = require "utils/Emitter"

LiveInfoWrapper = require "browser/wrapper/LiveInfo"
MovieWrapper = require "browser/wrapper/Movie"
CommentWrapper = require "browser/wrapper/Comment"

module.exports =
class NsenChannelDelegater extends Emitter

    _handleSocketEvents : ->
        @_disposers?.dispose()
        @_disposers = new CompositeDisposable

        @_listenSocket "nsen/event/did-process-first-response", (comments) =>
            for comment in comments
                @emit "did-receive-comment", CommentWrapper.wrap(comment)

        @_listenSocket "nsen/event/did-refresh-live-info", (live) =>
            @_live = LiveInfoWrapper.wrap(live)

        @_listenSocket "nsen/event/did-receive-comment", (comment) =>
            @emit "did-receive-comment", CommentWrapper.wrap(comment)

        @_listenSocket "nsen/event/did-change-movie", ({previous, current}) =>
            @_currentVideo = MovieWrapper.wrap(current)
            @emit "did-change-movie", MovieWrapper.wrap(current), MovieWrapper.wrap(previous)

        @_listenSocket "nsen/event/did-receive-good", =>
            @emit "did-receive-good"

        console.info "Start socket stream listening"

        return

    _listenSocket : (event, listener) ->
        @_socket.on event, listener

        @_disposers.add new Disposable =>
            @_socket.removeListener event, listener

    getLiveInfo     : ->
        @_live

    getCurrentVideo : ->
        @_currentVideo

    setSession : (@_session) ->
        @_socket = @_session.getSocket()
        @_handleSocketEvents()

    changeChannel : (channel) ->
        @_session.request("nsen/command/change-channel", {channelId: channel})

    postComment : (comment, command) ->
        @_session.request "nsen/command/post-comment", {comment, command}

    pushGood : ->
        @_session.request "nsen/command/push-good"

    pushSkip : ->
        @_session.request "nsen/command/push-skip"

    dispose : ->
        super
        @_disposers.dispose()

    # Events

    onDidReceiveComment : (listener) ->
        @on "did-receive-comment", listener

    onDidChangeMovie : (listener) ->
        @on "did-change-movie", listener

    onDidReceiveGood : (listener) ->
        @on "did-receive-good", listener

    onDidReceiveAddMylist : (listener) ->
        @on "did-receive-add-mylist", listener

    onDidPushGood : (listener) ->
        @on "did-push-good", listener

    onDidPushSkip : (listener) ->
        @on "did-push-skip", listener

    onDidSendRequest : (listener) ->
        @on "did-send-request", listener

    onDidCancelRequest : (listener) ->
        @on "did-cancel-request", listener

    onWillClose : (listener) ->
        @on "will-close", ->
