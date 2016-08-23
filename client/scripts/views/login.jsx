import React from 'react';

import NcoActions from '../actions/nco-actions';
import NsenChannels from '../../../shared/NsenChannels';

export default class ShellView extends React.Component
{
    static propTypes = {
        nsenConfig: React.PropTypes.shape({
            defaultChannel: React.PropTypes.string,
        }),
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
            <div id="nco-login">
                <div className="NcoLogin">
                    <div className="NcoLogin_backface">
                        <form onSubmit={e => false} className="NcoLogin_modal">
                            <h1>ニコニコ動画へログイン</h1>
                            <div className="NcoLogin_form">
                                <div className="NcoLogin_form_group">
                                    <label htmlFor="nco-login-form-email" className="NcoLogin_form_label">メールアドレス</label>
                                    <input id="nco-login-form-email" type="text" name="email" className="NcoLogin_form_input"/>
                                </div>
                                <div className="NcoLogin_form_group">
                                    <label htmlFor="nco-login-form-password" className="NcoLogin_form_label">パスワード</label>
                                    <input id="nco-login-form-password" type="password" name="password" className="NcoLogin_form_input"/>
                                </div>
                                <div className="NcoLogin_form_group">
                                <div className="NcoLogin_form_label"></div>
                                    <label className="NcoLogin_form_label container">
                                        <input type="checkbox" name="memory"/>ログイン情報を保存する
                                    </label>
                                </div>
                                <div className="NcoLogin_error"></div>
                            </div>
                            <div className="NcoLogin_modal_footer">
                                <button className="NcoLogin_form_submit">ログイン</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
