import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

class AuthStore extends ReduceStore
{
    getInitialState()
    {
        return Immutable.Record({
            logged: false,
            failedReason: null,
        })();
    }

    reduce(state, action)
    {
        switch (action.actionType) {
        case Actions.NCO_AUTH_UPDATE_STATUS:
            return state.merge(action.payload);
        }

        return state;
    }
}

export default new AuthStore(Dispatcher);
