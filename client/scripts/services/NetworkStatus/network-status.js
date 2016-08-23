import NcoActions from '../../actions/nco-actions';

// TODO
window.addEventListener('online', () => {
    NcoActions.ncoNetworkStateChanged({connected: true});
});

window.addEventListener('offline', () => {
    NcoActions.ncoNetworkStateChanged({connected: false});
});
