_ = require "lodash"
__ = require "lodash-deep"
Emitter = require "utils/Emitter"

Emitter = require "utils/Emitter"
deepDelete = (obj, keyPath) ->
    # from http://stackoverflow.com/questions/5059951/deleting-js-object-properties-a-few-levels-deep
    paths = keyPath.split(".")

    if paths.length > 1
        deepDelete(obj[paths[0]], paths[1..].join("."))
    else
        delete obj[keyPath]

    return

module.exports =
class ConfigManager
    constructor : (options = {}) ->
        {saveThrottleMs, jsonIndent, defaultSetting} = options

        @_defaultSetting = defaultSetting ?= {}
        @_saveThrottleMs = saveThrottleMs ? 200
        @_jsonIndent ?= "  "

        @_emitter = new Emitter
        @_store = {}

        @save = _.throttle @save.bind(@), @_saveThrottleMs

    ###*
    # Load config file
    ###
    load : ->
        @_store = {}

        for key, value of window.localStorage
            try
                @_store[key] = JSON.parse value
            catch e
                @_store[key] = value

        @_store = _.defaultsDeep @_store, @_defaultSetting

        @_emitter.emit "did-load-config-file"
        return

    ###*
    # Save current config to config file
    ###
    save : ->
        for key, value of @_store
            window.localStorage.setItem key, JSON.stringify(value)

        @_emitter.emit "did-save-config-file"
        return

    ###*
    # Set config value
    # @param {String}       keyPath     Config key name (accept dot delimited key)
    ###
    set : (keyPath, value) ->
        oldValue = @get keyPath
        return if _.isEqual(oldValue, value)

        __.deepSet(@_store, keyPath, value)
        @_emitter.emit "did-change", {key: keyPath, newValue: value, oldValue}
        @save()
        return

    ###*
    # Get configured value
    # @param {String}       keyPath     Config key name (accept dot delimited key)
    ###
    get : (keyPath, defaultValue) ->
        value = __.deepGet(@_store, keyPath)
        return if value is undefined then defaultValue else value

    ###*
    # Unset config value
    # @param {String}       keyPath     Config key name (accept dot delimited key)
    ###
    delete : (keyPath) ->
        oldValue = @get(keyPath)
        deepDelete(@_store, keyPath)
        @_emitter.emit "did-change", {key: keyPath, newValue: undefined, oldValue, deleted: true}
        @save()
        return

    ###*
    # Observe specified configure changed
    # @param {String}       keyPath     Observing config key name (accept dot delimited key)
    # @param {Function}     observer    callback function
    ###
    observe : (keyPath = null, observer) ->
        oldValue = @get keyPath

        @onDidChange =>
            newValue = @get keyPath
            observer(newValue, oldValue) unless _.isEqual(newValue, oldValue)
            oldValue = newValue

    ###*
    # Unobserve specified configured change observer
    # @param {String}       keyPath     Observing config key name (accept dot delimited key)
    # @param {Function}     observer    callback function
    ###
    unobserve : (keyPath = null, observer) ->
        @off "did-change", observer

    #
    # Events
    #

    ###*
    # @param {Function}     fn          callback
    ###
    onDidLoadConfigFile : (fn) ->
        @_emitter.on "did-load-config-file"

    ###*
    # @param {Function}     fn          callback
    ###
    onDidSaveConfigFile : (fn) ->
        @_emitter.on "did-save-config-file"

    ###*
    # @param {Function}     fn          callback
    ###
    onDidChange : (fn) ->
        @_emitter.on "did-change", fn

    ###*
    # @param {Function}     fn          callback
    ###
    onDidInitializeConfigDirectory : (fn) ->
        @_emitter.on "did-init-config-directory"
