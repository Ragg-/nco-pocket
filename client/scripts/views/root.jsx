import React from 'react';

import PreferenceStore from '../stores/preference-store';
import AuthStore from '../stores/auth-store';

import ShellView from './shell';
import MainView from './main';
import ControlView from './control';
import LoginView from './login';
import PreferenceView from './preference';

export default class Root extends React.Component
{
    constructor(props = {})
    {
        super(props);

        this.state = {
            preference: PreferenceStore.getState(),
            auth: AuthStore.getState(),
        };

        PreferenceStore.addListener(() => { this.setState({preference: PreferenceStore.getState()}); });
        AuthStore.addListener(() => { this.setState({auth: AuthStore.getState()}); });
    }

    render()
    {
        console.log(this.state);
        return (
            <div id="nco-container">
                <ShellView channel={this.state.preference.nsen.defaultChannel} />
                <MainView />
                <ControlView />
                <LoginView />
                <PreferenceView />
            </div>
        );
    }
}
