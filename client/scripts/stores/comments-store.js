import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

class CommentsStore extends ReduceStore
{
    static init(dispatcher)
    {
        CommentsStore.instance = new CommentsStore(dispatcher);
    }

    getInitialState()
    {
        return Immutable.List([]);
    }

    reduce(state, action)
    {
        switch (action.actionType) {
        case Actions.NCO_CHANNGE_CHANNEL:
            return state.clear();
        case Actions.NSEN_RECEIVE_COMMENT:
            return state.push(action.payload.comment);
        }

        return state;
    }
}

export default new CommentsStore(Dispatcher);
