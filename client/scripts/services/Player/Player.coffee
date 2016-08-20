BREAK_TIME_PLAYING_MOVIE = "sm13848574"

CONFIG_PLAYER_ENABLED = "nco.services.player.enabled"
CONFIG_PLAYER_VOLUME = "nco.services.player.volume"

module.exports =
class Player
    constructor : ->
        @_audioPlayer = document.createElement("audio")
        @_audioPlayer.style.display = "none"
        @_audioPlayer.autoplay = true
        @_audioPlayer.volume = 0

        @_lastLoadMovie = null

        @_handleEvents()
        @_handleCommands()
        @_handleNsenEvents()

    _handleCommands : ->
        app.command.on "services:player:play", =>
            @_loadMovie false, @_lastLoadMovie

    _handleEvents : ->
        $ =>
            document.body.appendChild(@_audioPlayer)

        $(@_audioPlayer).on "error", =>
            app.command.dispatch "comments:add"
            , "<div>サーバーのエンコード待機中です、もうしばらくお待ち下さい。</div>"
            , ["NcoComments_item-info"]

            return

        app.onDidLogin (session) =>
            socket = session.getSocket()

            socket.on "events/nco/encoder/stream-available", ({movieId}) =>
                console.log "Stream available: #{movieId} (playing: #{@_lastLoadMovie?.id})"
                return if @_lastLoadMovie?.id isnt movieId

                @_loadMovie()

        app.nsenStream.onDidChangeStream (channel) =>
            @_handleNsenEvents(channel)

        app.config.observe CONFIG_PLAYER_ENABLED, (enabled) =>
            if enabled is no
                @_stopMovie()
            else
                @_loadMovie(true)

            return

        app.config.observe CONFIG_PLAYER_VOLUME, (volume) =>
            $(@_audioPlayer).animate({volume}, 1000)

    _handleNsenEvents : (channel) ->
        return unless channel?

        channel.onDidChangeMovie (movie) =>
            return if app.config.get(CONFIG_PLAYER_ENABLED, yes) is no

            app.getSession()?.request "nsen/command/fetch-live-info"
            .then =>
                if movie?
                    @_loadMovie(false, movie)
                    return

            # # Play break time movie
            # app.getSession().video.getVideoInfo(BREAK_TIME_PLAYING_MOVIE)
            # .then (movie) => @_loadMovie(false, movie)

        return


    _loadMovie : (fadeIn = false, movie = null) ->
        ncoSession = app.getSession()
        channel = app.nsenStream.getStream()
        movie ?= channel.getCurrentVideo()
        live = channel?.getLiveInfo()

        return if false in [ncoSession?, channel?, movie?]
        return if app.config.get(CONFIG_PLAYER_ENABLED, false) is false

        @_lastLoadMovie = movie

        playContent = live.get("stream.contents.0")
        playContent.startTime = new Date(playContent.startTime)
        elapsedFromStart = (Date.now() - playContent.startTime) / 1000

        # Exception process for break time.
        if movie.id is BREAK_TIME_PLAYING_MOVIE
            elapsedFromStart = 0
            @_audioPlayer.loop = true
        else
            @_audioPlayer.loop = false

        if @_audioPlayer.src is "" or fadeIn
            volume = app.config.get(CONFIG_PLAYER_VOLUME)
            @_audioPlayer.volume = 0
            $(@_audioPlayer).animate({volume}, 2000)

        newSrc = "./stream/#{movie.id}"
        if  @_audioPlayer.src isnt newSrc
            @_audioPlayer.src = "./stream/#{movie.id}"

        $(@_audioPlayer).one "playing", =>
            @_audioPlayer.currentTime = elapsedFromStart

        @_audioPlayer.play()
        return

    _stopMovie : ->
        $(@_audioPlayer).animate {volume: 0}, 2000, =>
            @_audioPlayer.pause()
            @_audioPlayer.src = ""
