import React from "react";
import classname from "classname";

export default class ControlRequestView extends React.Component
{
    constructor(props = {})
    {
        super(props);
        this.state = {show: false};
    }

    render()
    {
        return (
            <div className="NcoControl_request">
                <div className={classname("NcoRequest", {show: this.state.show})}>
                    <div className="NcoRequest_header">
                        <div accessKey="esc" className="NcoRequest_header_closing fa fa-times"></div>
                        <div className="NcoRequest_header_title">リクエスト</div>
                    </div>
                    <div className="NcoRequest_mylists"></div>
                    <div className="NcoRequest_movies"></div>
                </div>
            </div>
        );
    }
}
