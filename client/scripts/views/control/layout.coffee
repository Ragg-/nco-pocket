RequestLayoutView       = require "./request/layout"
MylistSelectionView     = require "./mylist/listSelectionView"

CONFIG_POST_AS_ANONYMOUS = "nco.nsen.postAsAnonymous"

module.exports =
class NcoControlLayout extends Marionette.LayoutView
    template    : require "./view.jade"
    className   : "NcoControl"

    ui          :
        skip        : ".skip"
        good        : ".good"
        # mylist      : ".mylist"
        # request     : ".request"
        preference  : ".preference"
        reload      : ".reload"
        play        : ".play"

        alert       : ".NcoControl_comment_alert"
        commentArea : ".NcoControl_comment"
        anonyOpt    : "[name='comment_184']"
        input       : ".NcoControl_comment_input"

    events      :
        "submit @ui.commentArea" : "_onSubmitComment"
        "focus @ui.input"   : "_showOption"
        "blur @ui.input"    : "_hideOption"
        "change @ui.anonyOpt": "_memory184State"
        "touchend @ui.commentArea": "_keepFocusInInput"

        "touchend @ui.skip"    : "_onClickSkip"
        "touchend @ui.good"    : "_onClickGood"
        "touchend @ui.mylist"  : "_onClickMylist"
        "touchend @ui.request" : "_onClickRequest"
        "touchend @ui.preference" : "_onClickPreference"
        "touchend @ui.reload"  : "_onClickReload"
        "touchend @ui.play"    : "_onClickPlay"

    regions     :
        actions     : ".NcoControl_actions"
        comment     : ".NcoControl_comment"
        requestSelection    : ".NcoControl_request"
        mylistSelection     : ".NcoControl_mylist"


    initialize : ->
        app.nsenStream.onDidChangeStream =>
            @_listenEvents()

    _listenEvents : ->
        stream = app.nsenStream.getStream()
        return unless stream?

        stream.onDidReceiveComment =>
            @ui.good.addClass("received").one "webkitTransitionEnd", =>
                @ui.good.removeClass("received")

        stream.onDidReceiveAddMylist =>
            @ui.mylist.addClass("received").one "webkitTransitionEnd", =>
                @ui.mylist.removeClass("received")

    onShow          : ->
        # ビューを表示
        @requestSelection.show new RequestLayoutView
        @mylistSelection.show new MylistSelectionView

        # @$(".NcoControl_actions [title]").powerTip({placement: "w"})

        # フォーム状態を復元
        @ui.anonyOpt[0]?.checked = app.config.get(CONFIG_POST_AS_ANONYMOUS)


    _showError      : do ->
        timerId = null

        (msg) ->
            $alert = @ui.alert
            $alert
                .text msg
                .fadeIn
                    duration    : 300
                    done        : ->
                        if timerId isnt null
                            clearTimeout timerId

                        setTimeout ->
                            $alert.fadeOut 300
                        , 1000



    _memory184State  : ->
        app.config.set CONFIG_POST_AS_ANONYMOUS, @ui.anonyOpt[0]?.checked

    _onSubmitComment : (e) ->
        # keyCode 13 = Enter
        # return true if e.keyCode isnt 13 or e.shiftKey is true

        option = if @ui.anonyOpt[0].checked then "184" else ""

        app.nsenStream.getStream()?.postComment @ui.input.val(), option
        .catch (e) => @_showError e.message
        .then => @ui.input.val ""

        false

    _onClickReload   : ->
        location.reload()

    _onClickGood     : ->
        app.command.dispatch "channel:push-good"

    _onClickSkip     : ->
        app.command.dispatch "channel:push-skip"

    _onClickPlay : ->
        app.command.dispatch "services:player:play"

    # _onClickRequest  : ->
    #     @requestSelection.currentView.open()
    #
    # _onClickMylist   : ->
    #     view = @mylistSelection.currentView
    #     if view.isOpened() then view.close() else view.open()

    _onClickPreference : ->
        app.command.dispatch "app:show-settings"
        return

    _showOption      : ->
        @ui.commentArea.addClass "focus"
        $(document).one "click", @_globalClickListener.bind(@)
        return

    _hideOption      : ->
        # @ui.commentArea.removeClass "focus"
        return

    _keepFocusInInput: ->
        # @ui.input[0].focus()

    ###*
    # 領域外クリックを検出して
    # コメント入力欄のフォーカス状態を解除するリスナ
    ###
    _globalClickListener : (e)->
        $parents = $(e.target).parents()

        if $parents.filter(@ui.commentArea).length is 0
            @ui.commentArea.removeClass "focus"
        else
            $(document).one "click", @_globalClickListener.bind(@)
