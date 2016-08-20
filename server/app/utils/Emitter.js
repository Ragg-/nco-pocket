import {Emitter as EE, Disposable, CompositeDisposable} from "event-kit";
import EventEmitter3 from "eventemitter3";

export default class Emitter extends EventEmitter3 {
    // eventObservers = null;
    // disposed = false;

    constructor() {
        super();
        this.eventObservers = new CompositeDisposable;
    }

    dispose() {
        this.eventObservers.dispose();
        this._events = null;
        this.eventObservers = null;
        this.disposed = true;
    };


    /**
     * @param {String} event     listening event name
     * @param {Function} fn      listener
     * @param {Object?} context  binding context to listener
     */

    on(event, fn, context) {
        var disposer;
        if (context == null) {
            context = this;
        }
        if (this.disposed) {
            throw new Error("Emitter has been disposed");
        }
        super.on.apply(this, arguments);
        disposer = new Disposable(() => {
            this.off(event, fn, context, false);
        });

        this.eventObservers.add(disposer);
        return disposer;
    };


    /**
     * @param {String} event     listening event name
     * @param {Function} fn      listener
     * @param {Object?} context  binding context to listener
     */

    once(event, fn, context) {
        var disposer;
        if (context == null) {
            context = this;
        }
        if (this.disposed) {
            throw new Error("Emitter has been disposed");
        }
        super.once(event, fn, context);

        disposer = new Disposable(() => {
            this.off(event, fn, context, true);
        });

        this.eventObservers.add(disposer);

        return disposer;
    };


    /**
     * @param {String} event     unlistening event name
     * @param {Function?} fn      unlistening listener
     * @param {Object?} context  binded context to listener
     * @param {Boolean?} once    unlistening once listener
     */

    off(event, fn, context, once) {
        if (this.disposed) {
            return;
        }
        if (fn == null) {
            this.removeAllListeners();
            return;
        }
        super.off.apply(this, arguments);
    };

    removeAllListeners(event) {
        if (this.disposed) {
            return;
        }
        return super.removeAllListeners.apply(this, arguments);
    };

    addListener(event, listener) {
        super.on(event, listener);
    }

    removeListener(event, listener) {
        super.off(event, listener);
    }
}
