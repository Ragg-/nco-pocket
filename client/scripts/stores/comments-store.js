import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

class CommentsStore extends ReduceStore
{
    getInitialState()
    {
        return Immutable.List([]);
    }

    reduce(state, action)
    {
        switch (action.actionType) {
        case Actions.NCO_CHANNGE_CHANNEL:
            return state.clear();
        case Actions.NSEN_RECEIVE_COMMENTS:
            let {comments} = action.payload;
            return comments.length > 0 && state.push(...comments);
        }

        return state;
    }
}

export default new CommentsStore(Dispatcher);
