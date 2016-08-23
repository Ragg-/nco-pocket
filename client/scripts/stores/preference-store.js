import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';
import defaultSetting from "../app/default-setting";

class PreferenceStore extends ReduceStore
{
    static init(dispatcher)
    {
        PreferenceStore.instance = new PreferenceStore(dispatcher);
    }

    getInitialState()
    {
        const Preference = Immutable.Record(defaultSetting);

        const serialized = localStorage.getItem('nco');
        const store = serialized ? JSON.parse(serialized) : defaultSetting;
        return new Preference(store);
    }

    reduce(state, action)
    {
        switch (action.actionType) {
        case Actions.NCO_CHANNGE_CHANNEL:
            return state.set(LocalStorageKeys.NSEN_DEFAULT_CHANNEL, payload.channel);

        case Actions.NCO_PREFERENCE_SAVE:
            return state.merge(payload.config);
        }

        return state;
    }

    __emitChange()
    {
        super.__emitChange();

        const serialize = JSON.stringify(this.getState().toJS());
        localStorage.setItem('nco', serialize);
    }
}

export default new PreferenceStore(Dispatcher);
