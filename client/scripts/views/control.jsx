import React from 'react';
import classname from 'classname';

import fastTouch from '../utils/fast-touch';
import EventBox from '../utils/event-box';
import closest from '../utils/closest';

import NcoActions from '../actions/nco-actions';
import Modal from './modal';

import ControlCommentView from './control-comment';
import ControlRequestView from "./control-request";

export default class ControlView extends React.Component
{
    constructor(props = {})
    {
        super(props);
        this.state = {
            showRequestView: false,
            showMoreActions: false,
        };
    }

    componentDidMount()
    {
        let box = this.handlers = new EventBox();
        box.bind(window, ['touchend', 'click'], this._windowTouched.bind(this))
    }

    componentWillUnmount()
    {
        this.handlers.dispose();
        this.handlers = null;
    }

    _windowTouched(e)
    {
        if (this.state.showMoreActions && !closest(e.target, this.refs.moreActions)) {
            this.setState({showMoreActions: false});
            e.preventDefault();
        }
    }

    openRequest(e) {
        e.preventDefault();
        NcoActions.ncoMylistIndexFetch();
        this.setState({showRequestView: true});
    }

    closeRequest(e) {
        e.preventDefault();
        this.setState({showRequestView: false});
    }

    toggleMoreActions(e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.target !== e.currentTarget) { return; }
        this.setState({showMoreActions: ! this.state.showMoreActions})
    }

    closeMoreActions(e)
    {
        e.preventDefault();
        this.setState({showMoreActions: false})
    }

    openPreference(e)
    {
        e.preventDefault();

        this.closeMoreActions(e);
        NcoActions.ncoPreferenceOpen();
    }

    render()
    {
        return (
            <div id="nco-control">
                <div className="NcoControl">
                    {this.state.showRequestView ?
                        <Modal key='requestModal' show={true} mode='full' className='NcoControl_request'>
                            <ControlRequestView onClose={this.closeRequest.bind(this)} />
                        </Modal>
                    : null}
                    <div className="NcoControl_mylist"></div>
                    <ControlCommentView />
                    <div className="NcoControl_actions">
                        <button className="NcoControl_actions_btn skip fa fa-forward" title="Skip"></button>
                        <button className="NcoControl_actions_btn good fa fa-thumbs-up" title="Good"></button>
                        <button className="NcoControl_actions_btn mylist fa fa-star" title="Mylist" {...fastTouch(e => this.openAddListSelector)}></button>
                        <button className="NcoControl_actions_btn request fa fa-hand-o-right" title="Request" {...fastTouch(this.openRequest.bind(this))}></button>
                        <button className="NcoControl_actions_btn play fa fa-play" title="再生" {...fastTouch(this.doPlay)}></button>

                        <div className="NcoControl_actions_btn more fa fa-bars" title='他' tabIndex='-1' {...fastTouch(this.toggleMoreActions.bind(this))}>
                            <ul ref='moreActions' className={classname('NcoControl_more-actions', {'NcoControl_more-actions--show': this.state.showMoreActions})}>
                                <li><button className="NcoControl_actions_btn reload fa fa-refresh" title="リロード" {...fastTouch(e => location.reload())}></button></li>
                                <li><button className="NcoControl_actions_btn preference fa fa-cog" title="設定" {...fastTouch(this.openPreference.bind(this))}></button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
