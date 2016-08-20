import * as _ from "lodash";
import {Disposable} from "event-kit";

const Emitter = require("./Emitter");


/**
 * Renderer side Command manager
 */
export default class CommandManager extends Emitter {

    constructor() {
        super();

        this._emitter = new Emitter();
        this._domObservers = {};
    }


    /**
     * Dispatch command to Renderer and Browser process
     * @param {String} command
     * @param {Any...} args
     */
    dispatch(command, ...args) {
        const existsInCommandHandler = this.listeners(command, true);

        if (! existsInCommandHandler) {
            console.warn("\u001b[33mUnhandled command dispatched(" + command + ")\u001b[m");
            return;
        }

        this.emit.apply(this, [command, ...args]);
        this._emitter.emit("did-dispatch", command, args);
    }

    handle(command, handler) {
        if (_.isPlainObject(command)) {
            var disposables = _.map(command, (listener, commandName) => {
                this.on(commandName, listener);
            });

            return new Disposable(() => {
                disposables.forEach((disposable) => { disposable.dispose(); });
                disposables = null;
            });
        }

        return this.on(command, handler);
    }

    onDidDispatch(listener) {
        this._emitter.on("did-dispatch", listener);
    }
}
