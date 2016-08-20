__          = require "lodash-deep"

module.exports =
class UserWrapper
    @wrap : (userObj) ->
        return null unless userObj?
        new UserWrapper(userObj)

    ###*
    # @param {Object} props
    ###
    constructor : (props) ->
        Object.defineProperties @,
            id :
                value : props.id
            _attr :
                value : props

    get : (path) ->
        __.deepGet @_attr, path
