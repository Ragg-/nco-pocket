import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

class MyListIndexStore extends ReduceStore
{
    getInitialState()
    {
        return new Immutable.Map({
            loading: false,
            lists: [],
            items: new Immutable.Map({}),
        });
    }

    reduce(state, action)
    {
        switch (action.actionType) {
        case Actions.NCO_MYLIST_FETCH_START:
            return state.merge({loading: true});

        case Actions.NCO_MYLIST_INDEX_FETCHED:
            return state.merge({
                loading: false,
                lists: action.payload.list,
            });

        case Actions.NCO_MYLIST_ITEMS_FETCHED:
            return state.merge({
                loading: false,
                items: state.get('items').merge({
                    [action.payload.mylistId]: action.payload.items,
                }),
            });
        }

        return state;
    }
}

export default new MyListIndexStore(Dispatcher);
