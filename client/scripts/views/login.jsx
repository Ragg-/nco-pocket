import React from 'react';
import className from 'classname';

import AuthStore from '../stores/auth-store';
import NcoActions from '../actions/nco-actions';

export default class LoginView extends React.Component
{
    static propTypes = {
        nsenConfig: React.PropTypes.shape({
            defaultChannel: React.PropTypes.string,
        }),
    };

    constructor(props = {})
    {
        super(props);
        this._disposers = [];

        this.state = {
            auth: AuthStore.getState(),
        };
        this._disposers.push(AuthStore.addListener(() => {
            this.setState({auth: AuthStore.getState()});
        }).remove);
    }

    componentWillUnmount()
    {
        this._disposers.forEach(fn => fn());
    }

    requestLogin(e)
    {
        console.log({
            email: this.refs.email.value,
            password: this.refs.password.value,
        });
        e.preventDefault();
        e.stopPropagation();

        NcoActions.ncoAuthRequest({
            email: this.refs.email.value,
            password: this.refs.password.value,
        });
    }

    render()
    {
        return (
            <div id="nco-login">
                <div className={className("NcoLogin", {show: !this.state.auth.logged})}>
                    <div className="NcoLogin_backface">
                        <form onSubmit={e => this.requestLogin(e)} className="NcoLogin_modal">
                            <h1>ニコニコ動画へログイン</h1>
                            <div className="NcoLogin_form">
                                <div className="NcoLogin_form_group">
                                    <label htmlFor="nco-login-form-email" className="NcoLogin_form_label">メールアドレス</label>
                                    <input id="nco-login-form-email" ref="email" type="text" name="email" className="NcoLogin_form_input"/>
                                </div>
                                <div className="NcoLogin_form_group">
                                    <label htmlFor="nco-login-form-password" className="NcoLogin_form_label">パスワード</label>
                                    <input id="nco-login-form-password" ref="password" type="password" name="password" className="NcoLogin_form_input"/>
                                </div>
                                <div className="NcoLogin_form_group">
                                <div className="NcoLogin_form_label"></div>
                                    <label className="NcoLogin_form_label container">
                                        <input type="checkbox" ref="memory" name="memory"/>ログイン情報を保存する
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
