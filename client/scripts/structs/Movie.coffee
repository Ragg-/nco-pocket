__          = require "lodash-deep"

module.exports =
class MovieWrapper
    @wrap : (attr) ->
        return null unless attr?
        new MovieWrapper(attr.id, attr)

    constructor     : (movieId, @_attr) ->
        Object.defineProperties @,
            id :
                value : movieId

    isDeleted       : ->
      return @get "isDeleted"

    fetchGetFlv : ->
        throw new Error("fetchGetFlv can't be using.")

    get             : (path) ->
        return __.deepGet @_attr, path
