import React from 'react';
import classname from 'classname';

import NcoActions from '../actions/nco-actions';
import NsenActionCreators from '../actions/nsen-actions';

import EventBox from '../utils/event-box';
import closest from '../utils/closest';

export default class ControlCommentView extends React.Component
{
    constructor(props = {})
    {
        super(props);

        this.state = {
            focus: false,
        };
    }

    componentDidMount()
    {
        let box = this.handlers = new EventBox();
        box.bind(window, ['touchend', 'click'], this._windowTouched.bind(this))
    }

    componentDidUpdate(prevProps, prevState)
    {
        if (this.state.focus === false) {
            this.refs.comment.blur();
        }
    }

    _windowTouched(e)
    {
        if (this.state.focus && !closest(e.target, this.refs.root)) {
            this.setState({focus: false});
        }
    }

    onFocusInput(e)
    {
        this.setState({focus: true});
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
            <form ref='root' className={classname('NcoControl_comment', {focus: this.state.focus})}
                onSubmit={e => this.onCommentSubmit(e)}>
                <label className='NcoControl_comment_opt'>
                    <input type='checkbox' ref='anony' />
                    184で投稿
                </label>

                <div className='NcoControl_comment_alert'>エラー</div>

                <input ref='comment' className='NcoControl_comment_input' placeholder='コメント' onFocus={this.onFocusInput.bind(this)} />
            </form>
        );
    }
}
