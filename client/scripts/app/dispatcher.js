import DisposableEmitter from 'utils/emitter';

import Actions from '../const/Actions';

function assertEventName(name)
{
    if (! Object.values(Actions).includes(name)) {
        throw new Error(`Action '${name}' does not defined.`);
    }
}

export default new class extends DisposableEmitter
{
    emit()
    {
        throw new Error('Use Dispatcher#dispatch instead of Dispatcher#emit.');
    }

    on(event, observer)
    {
        assertEventName(event);
        super.on(event, observer);
    }

    dispatch(event, payload)
    {
        assertEventName(event);

        console.log("Dispatch event : %s", event, payload);
        super.emit(event, payload);
    }
};
