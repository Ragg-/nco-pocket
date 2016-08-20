__          = require "lodash-deep"

module.exports =
class LiveInfoWrapper
    @wrap : (attr) ->
        return null unless attr
        new LiveInfoWrapper(attr.stream.id, attr)

    constructor     : (liveId, @_attr) ->
        Object.defineProperties @,
            id :
                value : liveId


    ###*
    # 公式放送か調べます。
    # @return {boolean}
    ###
    isOfficialLive : ->
        !!@get("stream").isOfficial


    ###*
    # Nsenのチャンネルか調べます。
    # @return {boolean}
    ###
    isNsenLive : ->
        !!@get("stream").isNsen


    ###*
    # 放送が終了しているか調べます。
    # @return {boolean}
    ###
    isEnded         : ->
        @get("isEnded") is true


    ###*
    # @param {String}   path
    ###
    get : (path) ->
        __.deepGet @_attr, path
