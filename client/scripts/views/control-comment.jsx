import React from 'react';
import classname from 'classname';

import NcoActions from '../actions/nco-actions';
import NsenActionCreators from '../actions/nsen-actions';

export default class ControlCommentView extends React.Component
{
    constructor(props = {})
    {
        super(props);
        this.state = {
            focus: false,
        };
    }

    onFocusInput(e)
    {

    }

    onCommentSubmit(e)
    {
        e.preventDefault();
        e.stopPropagation();

        NsenActionCreators.nsenSendComment({
            comment: this.refs.comment.value,
            anony: this.refs.anony.checked,
        });

        this.refs.comment.value = '';
    }

    render()
    {
        return (
            <form className={classname("NcoControl_comment", {focus: this.state.focus})}
                onSubmit={e => this.onCommentSubmit(e)}>
                <label className="NcoControl_comment_opt">
                    <input type="checkbox" ref="anony" />
                    184で投稿
                </label>

                <div className="NcoControl_comment_alert">エラー</div>

                <input ref="comment" className="NcoControl_comment_input"
                    placeholder="コメント"
                />
            </form>
        );
    }
}
