import {Dispatcher} from 'flux';

import Actions from '../const/Actions';

const actionTypes = Object.values(Actions);
const dispatch = Dispatcher.prototype.dispatch;

const dispatcher = new Dispatcher();
dispatcher.dispatch = function (action) {
    if (! actionTypes.includes(action.actionType)) {
        throw new Error(`Action '${action.actionType}' does not defined.`);
    }

    dispatch.call(this, action);
};;

export default dispatcher;

// function assertEventName(name)
// {

// }
//
// export default new class extends DisposableEmitter
// {
//     emit()
//     {
//         throw new Error('Use Dispatcher#dispatch instead of Dispatcher#emit.');
//     }
//
//     on(event, observer)
//     {
//         assertEventName(event);
//         super.on(event, observer);
//     }
//
//     dispatch(event, payload)
//     {
//         assertEventName(event);
//
//         console.log("Dispatch event : %s", event, payload);
//         super.emit(event, payload);
//     }
// };
