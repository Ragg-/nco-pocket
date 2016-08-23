import React from 'react';

import NcoActions from '../actions/nco-actions';
import NsenChannels from '../../../shared/NsenChannels';

export default class ShellView extends React.Component
{
    static propTypes = {
        channel: React.PropTypes.string,
    };

    constructor(props = {})
    {
        super(props);
    }

    onChangeChannel(e)
    {
        NcoActions.ncoChangeChannel({channel: e.target.value});
    }

    render()
    {
        const channelSelections = NsenChannels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>);

        return (
            <div id="nco-shell">
                <div className="NcoShell">
                    <div className="NcoShell_nelchan">
                        <select className="NcoShell_nelchan_select"
                            value={this.props.channel}
                            onChange={e => this.onChangeChannel(e)}>
                            {channelSelections}
                        </select>
                    </div>
                    { /*
                    <div className="NcoShell_ctrl">
                        <button className="NcoShell_ctrl_btn close"></button>
                        <button className="NcoShell_ctrl_btn maximize"></button>
                        <button className="NcoShell_ctrl_btn minimize"></button>
                        <button className="NcoShell_ctrl_btn pin"></button>
                    </div>
                    */ }
                </div>
            </div>
        );
    }
}
