import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';
import LocalStorageKeys from '../const/LocalStorageKeys';
import defaultSetting from "../app/default-setting";

class PreferenceStore extends ReduceStore
{

    getInitialState()
    {
        const serialized = localStorage.getItem('nco');
        const store = serialized ? JSON.parse(serialized) : defaultSetting;
        return store;
    }

    reduce(state, action)
    {
        switch (action.actionType) {
        case Actions.NCO_CHANNGE_CHANNEL:
            return Object.assign({}, state, {
                defaultChannel: action.payload.channel,
            });

        case Actions.NCO_PREFERENCE_SAVE:
            return Object.assign({}, state, action.payload.config);
        }

        return state;
    }

    __emitChange(payload)
    {
        super.__emitChange(payload);

        const serialized = JSON.stringify(this.getState());
        localStorage.setItem('nco', serialized);
    }
}

export default new PreferenceStore(Dispatcher);
