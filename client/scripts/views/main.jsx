import React from "react";

import CommentView from './main-comment';

export default class MainView extends React.Component
{
    constructor(props = {})
    {
        super(props);
        this.state = {};
    }

    render()
    {
        return (
            <div id="nco-main">
                <div className="NcoNotifier">
                    {
                    // <div class="NcoNotifier_item.info">
                    // </div>
                    }
                </div>
                <CommentView comments={[]} />
            </div>
        );
    }
}
