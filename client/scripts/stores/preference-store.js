import * as _ from 'lodash';
import * as __ from 'lodash-deep'
import Emitter from '../utils/emitter';

import Actions from '../const/Actions';
import Dispatcher from '../app/dispatcher';
import LocalStorageKeys from '../const/LocalStorageKeys';
import DefaultConfig from "../app/default-setting";

const serial = localStorage.getItem('nco');
const _store = JSON.parse(serial || JSON.stringify(DefaultConfig));
const _emitter = new Emitter();

function setState(key, value)
{
    Store.assertKey(key);
    _.set(_store, key, value);

    const serialize = JSON.stringify(_store);
    localStorage.setItem('nco', serialize);
    _emitter.emit("change");
}

export default class Store
{
    static init()
    {
        Dispatcher.on(Actions.NSEN_CHANGE_CHANNEL, ({channel}) => {
            setState(LocalStorageKeys.NSEN_DEFAULT_CHANNEL, channel);
        });
    }

    static observe(callback)
    {
        return _emitter.on('change', callback);
    }

    static assertKey(key)
    {
        if (! Object.values(LocalStorageKeys).includes(key)) {
            throw new Error(`Key ${key} does not defined in LocalStorageKeys.`);
        }
    }

    static getState(key)
    {
        if (key == null) {
            return _.cloneDeep(_store);
        }

        Store.assertKey(key);
        return _.cloneDeep(_.get(_store, key, _store));
    }
}
