packageJson = require "../../../../package.json"

Colors = require "../colors"

module.exports =
class Migrater
    @migrate : =>

    @set : (k, v) =>
        app.config.set k, v
        return

    @get : (k) =>
        app.config.get k

    @moved : (fromKey, toKey, unsetKey) =>
        @set toKey, @get(fromKey)
        @set unsetKey ? fromKey, undefined

    #
    # Migration definitions
    #
