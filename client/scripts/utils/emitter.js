import {CompositeDisposable, Disposable} from 'event-kit';
import EventEmitter3 from 'eventemitter3';

export default class Emitter extends EventEmitter3
{
    eventObservers = null;
    disposed = null;

    constructor()
    {
        super();
        this.eventObservers = new CompositeDisposable();
    }

    dispose()
    {
        this.eventObservers.dispose();
        this._events = null;
        this.eventObservers = null;
        this.disposed = true;
        return true;
    }

    /**
     * @param {String} event     listening event name
     * @param {Function} fn      listener
     * @param {Object?} context  binding context to listener
     */
    on(event, fn, context)
    {
        if (context == null) {
            context = this;
        }

        if (this.disposed) {
            throw new Error("Emitter has been disposed");
        }

        super.on(event, fn, context);

        const disposer = new Disposable(() => {
            this.off(event, fn, context, false);
        });

        this.eventObservers.add(disposer);
        return disposer;
    }


    /**
     * @param {String} event     listening event name
     * @param {Function} fn      listener
     * @param {Object?} context  binding context to listener
     */
    once(event, fn, context) {
        if (context == null) {
            context = this;
        }

        if (this.disposed) {
            throw new Error("Emitter has been disposed");
        }

        super.once(event, fn, context);

        const disposer = new Disposable(() => {
            this.off(event, fn, context, true);
        });

        this.eventObservers.add(disposer);
        return disposer;
    }


    /**
     * @param {String} event     unlistening event name
     * @param {Function?} fn      unlistening listener
     * @param {Object?} context  binded context to listener
     * @param {Boolean?} once    unlistening once listener
     */
    off(event, fn, context, once)
    {
        if (this.disposed) {
            return;
        }

        if (fn == null) {
            this.removeAllListeners();
            return;
        }

        super.off(event, fn, context, once);
    }

    removeAllListeners(event)
    {
        if (this.disposed) {
            return;
        }

        super.removeAllListeners(event);
    }
}

Object.assign(Emitter.prototype, {
    dispach: EventEmitter3.prototype.emit,
    addListener: Emitter.prototype.on,
    removeListener: Emitter.prototype.off,
});
