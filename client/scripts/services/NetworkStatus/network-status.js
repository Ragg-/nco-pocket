// TODO
window.addEventListener('online', () => {
    Dispatcher.dispatch(Actions.NCO_NETWORK_STATE_CHANGED, {connected: true});
});

window.addEventListener('offline', () => {
    Dispatcher.dispatch(Actions.NCO_NETWORK_STATE_CHANGED, {connected: false});
});
