import React from 'react';
import ReactDOM from 'react-dom';



// # Emitter         = require "utils/Emitter"
// # Colors          = require "colors"
// # ConfigManager   = require "utils/ConfigManager"
// # CommandManager  = require "utils/CommandManager"
// # ContextMenuManager = require "utils/ContextMenuManager"
// # SocketIO        = require "thirdparty/socket.io"
// #
// # NcoSession      = require "./NcoSession"
// # NsenStream      = require "./NsenStream"
// # RegionManager   = require "./RegionManager"
// # # Migrater        = require "./Migrater"
// #
// # module.exports =
// # class App extends Emitter
// #     _session : null
// #
// #     constructor : ->
// #         super
// #
// #         global.app = @
// #
// #         Object.defineProperties @,
// #             currentWindow :
// #                 get : -> throw new Error("Can't be get 'app.currentWindow'")
// #
// #         @_initializeCoreModules()
// #         @_handleEvents()
// #         @_handleCommands()
// #
// #         # Migrater.migrate()
// #         @_initializeNcoModules()
// #         @_loadServices()
// #         @_restoreSession()
// #
// #     _initializeCoreModules : ->
// #         @command = new CommandManager
// #         @contextMenu = new ContextMenuManager
// #         @config = new ConfigManager
// #             defaultSetting : require "./defaultSetting"
// #         @config.load()
// #
// #         return
// #
// #
// #     _initializeNcoModules : ->
// #         @socket = SocketIO("http://#{location.host}")
// #         @nsenStream = new NsenStream
// #
// #         $ =>
// #             $(document).on "click", "a", ->
// #                 return false if @href in ["#", ""]
// #                 app.command.dispatch "shell:open-url", @href
// #                 false
// #
// #             $("body")
// #             .addClass "platform-#{process.platform}"
// #             .append require("views/nco/view.jade")()
// #             @region = new RegionManager
// #
// #             @emit "did-initialize"
// #
// #         return
// #
// #
// #
// #     _handleEvents : ->
// #         window.addEventListener "contextmenu", (e) =>
// #             setTimeout =>
// #                 # Why use setTimeout???
// #                 # event.path is buggy, execute `event.path` immediately,
// #                 # e.path is broken... (array is only `window`)
// #                 # WebKit has an bug?
// #                 @contextMenu.showForElementPath e.path.reverse()
// #             , 0
// #
// #         window.addEventListener "online", =>
// #             @emit "did-change-network-state", true
// #
// #         window.addEventListener "offline", =>
// #             @emit "did-change-network-state", false
// #
// #         @contextMenu.onDidClickCommandItem (command, el) =>
// #             @command.dispatch command
// #             return
// #
// #         @onDidChangeNetworkState (isOnLine) =>
// #             if isOnLine is no
// #                 console.info "%cNetwork state was changed to %cOffline", Colors.text.info, Colors.text.danger
// #
// #                 app.command.dispatch "shell:notify", "Nco",
// #                     body : "ネットワーク接続が切断されました"
// #                     timeout : 2000
// #             else
// #                 console.info "%cNetwork state was changed to %cOnline", Colors.text.info, Colors.text.primary
// #                 app.command.dispatch "session:relogin"
// #
// #         return
// #
// #
// #     _handleCommands : ->
// #         @command.on
// #             "shell:open-url" : (url) =>
// #                 window.open url
// #
// #             "shell:notify"  : (title, options) =>
// #                 console.error """"shell:notify" is obsoluted on mobile"""
// #
// #             "shell:dialog:save" : (options, callback) =>
// #                 Remote.require("dialog").showSaveDialog(null, options, callback)
// #                 return
// #
// #
// #             "session:relogin" : (callback) =>
// #                 console.info "%cRelogin...", Colors.text.info, @_session
// #
// #                 @_session?.relogin()
// #                 .then =>
// #                     console.info "%cRelogin successful.", Colors.text.info
// #                     @emit "did-login", @_session
// #
// #                     app.command.dispatch "channel:reset-session", @_session
// #                     return
// #
// #                 .catch (e) =>
// #                     console.error "Failed to relogin", e
// #                     return
// #
// #
// #             "session:login" : (user, pass, callback = ->) =>
// #                 NcoSession.login(user, pass)
// #                 .then (session) =>
// #                     @_session = session
// #
// #                     app.config.set "nco.auth.sessionId", @_session.sessionId()
// #                     app.command.dispatch "channel:reset-session", @_session
// #                     callback()
// #
// #                 .catch (e) ->
// #                     callback e
// #
// #
// #     _loadServices : ->
// #         @_services = s = []
// #         s.push new (require "services/NowPlaying/NowPlaying")
// #         s.push new (require "services/Player/Player")
// #         s.push new (require "services/Speech/Speech")
// #         s.push new (require "services/Comment/Comment")
// #
// #
// #     #
// #     # App methods
// #     #
// #
// #     _saveSession : ->
// #         return unless @_session?
// #         app.config.set "nco.auth.session", @_session.toJSON()
// #
// #
// #     _restoreSession : ->
// #         sessionId = app.config.get("nco.auth.sessionId")
// #
// #         console.info "%c[app.restoredSession] Session restoring...", Colors.text.info
// #
// #         unless sessionId?
// #             $ => @region.get("login").currentView.open()
// #             return
// #
// #         NcoSession.loginBySessionId sessionId
// #         .then (@_session) =>
// #             app.command.dispatch "channel:reset-session", @_session
// #             @emit "did-login", @_session
// #             console.info "%c[app.restoredSession] Session restored!", Colors.text.success
// #         .catch (e) =>
// #             @region.get("login").currentView.open()
// #
// #
// #     #
// #     # states
// #     #
// #
// #     ###*
// #     # @return {Boolean}
// #     ###
// #     hasSession : ->
// #         @_session?
// #
// #
// #     getSession : ->
// #         @_session
// #
// #
// #     #
// #     # Event handler
// #     #
// #
// #     onDidInitialize : (listener) ->
// #         @on "did-initialize", listener
// #
// #     onDidChangeNetworkState : (listener) ->
// #         @on "did-change-network-state", listener
// #
// #     onLoginRequired : (listener) ->
// #         @on "login-required", listener
// #
// #     onDidChangeChannel : (listener) ->
// #         @on "did-change-channel", listener
// #
// #     onDidLogin : (listener) ->
// #         @on "did-login", listener
