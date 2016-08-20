Emitter         = require "utils/Emitter"
Colors          = require "colors"
{CompositeDisposable} = require "event-kit"
NsenChannels    = require "./NsenChannels"
NsenChannelDelegater = require "browser/NsenChannelDelegater"

CONFIG_LAST_SELECT_CHANNEL = "nco.nsen.lastSelectChannel"


module.exports =
class ChannelManager extends Emitter
    constructor : ->
        super

        @_channelId = app.config.get(CONFIG_LAST_SELECT_CHANNEL)
        @_activeStream = new NsenChannelDelegater

        @_handleEvents()
        @_handleCommands()

    _handleEvents : ->

    _handleCommands : ->
        app.command.on
            "channel:reset-session" : (session) =>
                @setSession session

            "channel:change" : (channel) =>
                @changeChannel(channel)

            "channel:push-request" : (movieId) =>
                @_activeStream?.pushRequest(movieId)

            "channel:cancel-request" : =>
                @_activeStream?.cancelRequest()

            "channel:push-good" : =>
                @_activeStream?.pushGood()

            "channel:push-skip" : =>
                @_activeStream?.pushSkip()

        return


    ###*
    # Get current channel id (likes "nsen/***")
    ###
    currentChannel : ->
        @_channelId


    getStream : ->
        @_activeStream


    setSession : (@_session) ->
        @_activeStream.setSession @_session
        return unless @_channelId?

        console.info "%c[NsenStream] Channel changing to #{@_channelId}", Colors.text.info

        @_activeStream.changeChannel @_channelId
        .then (result) =>
            console.log "Channel changed.", result
            @emit "did-change-stream", @_activeStream

        console.info "%c[NsenStream] Active session changed.", Colors.text.success

    changeChannel : (channelId) ->
        return if channelId is @_channelId
        return unless @_session?

        console.info "%c[NsenStream] Channel changing to #{channelId}", Colors.text.info

        @_channelId = channelId
        app.config.set CONFIG_LAST_SELECT_CHANNEL, channelId

        @_activeStream.changeChannel channelId
        .then (result) =>
            console.log "Channel changed.", result

            @emit "did-change-stream", @_activeStream
            @emit "did-change-channel", @_activeStream

    #
    # Events
    #

    onDidChangeStream : (listener) ->
        @on "did-change-stream", listener

    onDidChangeChannel : (listener) ->
        @on "did-change-channel", listener
