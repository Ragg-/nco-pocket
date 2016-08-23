import * as _ from 'lodash';
import * as __ from 'lodash-deep'
import Emitter from '../utils/emitter';

import Dispatcher from '../app/dispatcher';
import Actions from '../const/Actions';

const ACCEPTED_KEYS = ['logged', 'success'];
const _store = {logged: false};
const _emitter = new Emitter();

function setState(key, value)
{
    AuthStore.assertKey(key);
    _.set(_store, key, value);
    _emitter.emit("change");
}

export default class AuthStore
{
    static init()
    {
        Dispatcher.on(Actions.NCO_AUTH_CHECK_AND_UPDATE_STATUS, async () => {
            const response = await (await fetch('/api/auth?check', {method: 'get', credentials: 'same-origin'})).json();
            setState('logged', response.authenticated);
        });

        Dispatcher.on(Actions.NCO_AUTH_REQUEST, async ({email, password}) => {
            const formData = Object.entries({email, password})
                .reduce((fd, entry) => { fd.append(entry[0], entry[1]); return fd; }, new FormData());

            const response = await (await fetch('/api/auth', {
                method: 'post',
                credentials: 'same-origin',
                body: formData,
            })).json();

            if (response.authenticated === false) {
                setState('success',false);
                setState('logged', false);
                return;
            }

            setState('logged', response.authenticated);
        });
    }

    static observe(callback)
    {
        return _emitter.on('change', callback);
    }

    static assertKey(key)
    {
        if (! ACCEPTED_KEYS.includes(key)) {
            throw new Error(`Key ${key} does not defined in AuthStore::ACCEPTED_KEYS.`);
        }
    }

    static getState(key)
    {
        if (key == null) {
            return _.cloneDeep(_store);
        }

        AuthStore.assertKey(key);
        return _.cloneDeep(_.get(_store, key, _store));
    }
}
