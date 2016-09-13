import _ from 'lodash';
import React from 'react';
import {PropTypes} from 'react';
import classname from 'classname';

import AuthStore from '../stores/auth-store';
import PreferenceStore from '../stores/preference-store';
import NcoActions from '../actions/nco-actions';

export default class ModalView extends React.Component
{
    static propTypes = {
        show: PropTypes.bool.isRequired,
        mode: PropTypes.oneOf(['full', 'window']),
        className: PropTypes.string,
    };

    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className={classname(
                'Modal',
                {'Modal--show': this.props.show},
                `Modal--mode-${this.props.mode}`,
                this.props.className
            )}>
                <div className='Modal_inner'>
                {this.props.children}
                </div>
            </div>
        );
    }
}
