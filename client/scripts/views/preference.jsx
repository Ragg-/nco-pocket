import React from 'react';
import classname from "classname";

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

import NcoActions from '../actions/nco-actions';

import fastTouch from '../utils/fast-touch';

export default class PreferenceView extends React.Component
{
    static propTypes = {
        nsenConfig: React.PropTypes.shape({
            defaultChannel: React.PropTypes.string,
        }),
    };

    constructor(props = {})
    {
        super(props);
        this.state = {show: false};

        Dispatcher.register(action => {
            switch (action.actionType) {
            case Actions.NCO_PREFERENCE_OPEN:
                return this.setState({'show': true});
            case Actions.NCO_PREFERENCE_CLOSE:
                return this.setState({'show': false});
            }
        });
    }

    closePreference(e)
    {
        e.preventDefault();
        this.setState({'show': false});
    }

    savePreference(e)
    {
        e.preventDefault();

        NcoActions.ncoPreferenceSave({playerEnabled: this.refs.playerEnabled.checked});
        this.setState({'show': false});
    }

    render()
    {
        return (
            <div id="nco-preference">
                <div className={classname("NcoPref", {show: this.state.show})}>
                    <div className="NcoPref_backface">
                        <div className="NcoPref_modal">
                            <h1>設定</h1>

                            <div className="NcoPref_section">
                                <h2 className="NcoPref_section_header">プレイヤー</h2>
                                <div className="NcoPref_form_group">
                                    <label htmlFor="pref-enable-player" className="NcoPref_form_label">Nsenプレイヤーを有効</label>
                                    <input id="pref-enable-player" type="checkbox" ref="playerEnabled" className="NcoPref_form_input"/>
                                </div>

                                <div className="NcoPref_form_group">
                                    <label htmlFor="pref-player-volume" className="NcoPref_form_label">プレイヤー音量</label>
                                    <input id="pref-player-volume" type="range" name="nco.services.player.volume" min="0" max="1" step="0.01" className="NcoPref_form_input"/>
                                    <span data-valueof="nco.services.player.volume" className="NcoPref_form_value"></span>
                                    <span className="NcoPref_form_anotate">iPhoneでは無視されます。</span>
                                </div>
                            </div>

                            <div className="NcoPref_section NcoPref_section-collapse">
                                <h2 className="NcoPref_section_header">連絡先</h2>
                                <dl className="NcoPref_address">
                                    <dt>リポジトリ（配布元）</dt>
                                    <dd><a href="https://github.com/ragg-/nco">GitHub (ragg-/nco)</a></dd>

                                    <dt>制作（連絡先）</dt>
                                    <dd><a href="http://twitter.com/_ragg_">@_ragg_</a></dd>
                                </dl>
                            </div>

                            <div className="NcoPref_section NcoPref_section-collapse">
                                <h2 className="NcoPref_section_header">オープンソース ライセンス</h2>
                                <ul className="NcoPref_licenses">
                                    <li><a href="https://github.com/babel/babel/blob/master/LICENSE">Babel</a></li>
                                    <li><a href="https://github.com/atom/event-kit/blob/master/LICENSE.md">event-kit</a></li>
                                    <li><a href="https://github.com/Ragg-/node-nicovideo-api/blob/dev/LICENSE">node-nicovideo-api</a></li>
                                    <li><a href="https://github.com/request/request-promise/blob/master/LICENSE">request-promise</a></li>
                                    <li><a href="https://github.com/bcoe/yargs/blob/master/LICENSE">yargs</a></li>
                                    <li><a href="https://jquery.org/license/">jQuery</a></li>
                                    <li><a href="https://lodash.com/license">lodash</a></li>
                                    <li><a href="https://github.com/stevenbenner/jquery-powertip/blob/master/LICENSE.txt">PowerTip</a></li>
                                    <li><a href="https://mplus-fonts.osdn.jp/mplus-outline-fonts/#license">M+ OUTLINE FONTS</a></li>
                                </ul>
                            </div>

                            <div className="NcoPref_modal_footer">
                                <button className="NcoPref_form_cancel" type="button" {...fastTouch(e => this.closePreference(e))}>キャンセル</button>
                                <button className="NcoPref_form_submit" {...fastTouch(e => this.savePreference(e))}>保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
