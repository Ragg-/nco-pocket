import React from "react";

import CommentsStore from '../stores/comments-store';


export default class MainView extends React.Component
{
    constructor(props = {})
    {
        super(props);
        this.state = {comments: CommentsStore.getComments()};
        CommentsStore.observe(() => this.setState({comments: CommentsStore.getComments()}));
    }

    render()
    {
        return (
            <div id="nco-comments">
                <ul className="NcoComments">
                    {this.state.comments.map((comment, idx) => <li key={idx} className="NcoComments_item">{comment.comment}</li>)}
                </ul>
            </div>
        );
    }
}
