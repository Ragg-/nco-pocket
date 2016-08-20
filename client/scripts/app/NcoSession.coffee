Emitter = require "utils/Emitter"

UserWrapper = require "browser/wrapper/User"

module.exports =
class NcoSession extends Emitter
    @login : (user, pass) ->
        defer = Promise.defer()
        sock = app.socket

        sock.once "did-login", ({sessionId}) ->
            defer.resolve new NcoSession(sessionId, sock)

        sock.once "require-login", (e) ->
            defer.reject(e)

        sock.emit "try-login", {user, pass}
        defer.promise


    @loginBySessionId : (sessionId) ->
        defer = Promise.defer()
        sock = app.socket

        sock.on "did-login", ->
            defer.resolve new NcoSession(sessionId, sock)

        sock.once "require-login", (e) ->
            defer.reject(e)

        sock.emit "try-login", {sessionId}

        defer.promise


    constructor : (@_sessionId, @_socket) ->
        super

        session = @

        @user =
            _cache : {}

            getUserInfo : (userId) ->
                if @_cache[userId]?
                    return Promise.resolve @_cache[userId]

                session.request "nico:user:getUserInfo", {userId}
                .then ({user}) =>
                    Promise.resolve @_cache[userId] = UserWrapper.wrap(user)


    sessionId : ->
        @_sessionId


    getSocket : ->
        @_socket


    request : (command, options = null) ->
        id  = "#{Date.now() * Math.random()}"
        defer = Promise.defer()

        responseListener = ({commandId, result}) =>
            return if commandId isnt id
            defer.resolve result
            @_socket.removeListener "command:response", responseListener

        rejectListener = ({commandId, error}) =>
            return if commandId isnt id
            defer.reject error
            @_socket.removeListener "command:reject-response", rejectListener

        @_socket.on "command:response", responseListener
        @_socket.on "command:reject-response", rejectListener
        @_socket.emit "command:request", {commandId: id, command, options}

        defer.promise
