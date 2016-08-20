import React from "react";

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
            <div className="NcoNotifier_item">
                <div className="NcoNotifier_item_header">{title}</div>
                <div className="NcoNotifier_item_detail">{body}</div>
            </div>
        );
    }
}
