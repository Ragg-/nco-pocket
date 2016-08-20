import React from 'react';

import Actions from "../const/Actions";
import Dispatcher from '../app/dispatcher';

import ControlCommentView from './control-comment';
import ControlRequestView from "./control-request";

export default class ControlView extends React.Component
{
    constructor(props = {})
    {
        super(props);
        this.state = {};
    }

    render()
    {
        return (
            <div id="nco-control">
                <div className="NcoControl">
                    <ControlRequestView />
                    <div className="NcoControl_mylist"></div>
                    <ControlCommentView />
                    <div className="NcoControl_actions">
                        <button className="NcoControl_actions_btn skip fa fa-forward" title="Skip"></button>
                        <button className="NcoControl_actions_btn good fa fa-thumbs-up" title="Good"></button>

                        {
                        // <button className="NcoControl_actions_btn mylist fa fa-star" title="Mylist"></button>
                        // <button className="NcoControl_actions_btn request fa fa-hand-o-right" title="Request"></button>
                        }
                        <button className="NcoControl_actions_btn reload fa fa-refresh" title="リロード"></button>
                        <button className="NcoControl_actions_btn preference fa fa-cog" title="設定"
                            onTouchEnd={e => Dispatcher.dispatch(Actions.NCO_PREFERENCE_OPEN)}></button>
                        <button className="NcoControl_actions_btn play fa fa-play" title="再生"></button>
                    </div>
                </div>
            </div>
        );
    }
}
