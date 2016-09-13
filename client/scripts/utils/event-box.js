export default class EventBox
{
    constructor()
    {
        this._handlers = [];
    }

    bind(target, event, listener)
    {
        if (!target || typeof target.addEventListener !== 'function') {
            throw new TypeError('target must be EventTarget');
        }

        let events = Array.isArray(event) ? event : [event];

        events.forEach(event => {
            target.addEventListener(event, listener, false);
            this._handlers.push([target, event, listener]);
        });
    }

    dispose()
    {
        this._handlers.forEach(([target, event, listener]) => {
            console.log(target, event, listener);
            target.removeEventListener(target, event, listener)
        });

        this._handlers = null;
    }
}
