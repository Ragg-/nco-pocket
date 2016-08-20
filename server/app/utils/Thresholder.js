import * as _ from "lodash";


class Worker {
    // working = false;

    constructor({delay}) {
        this._delay = delay;
        this.working = false;
        this.onWorkEnd = () => {};
    }

    process(process) {
        this.working = true;

        const next = () => {
            this.working = false;
        };

        return setTimeout(() =>{
            process().then(next, next);
        }, this._delay);
    };
};

/**
 * awaitableな関数を並列数・実行間隔を絞って実行してくれるやつ
 */
export default class Thresholder {
    constructor(arg) {
        const maxParallels = arg.maxParallels;
        const delay = arg.delay;
        const maxTask = arg.maxTask;
        const shiftOnOverTask = arg.shiftOnOverTask;

        this._maxTask = maxTask;
        this._shiftOnOverTask = !!shiftOnOverTask;
        this._maxParallels = maxParallels;
        this._delay = delay;
        this._que = [];

        this.workers = _.times(maxParallels, num => new Worker({delay}));

        this.start();
    }

    preQue(process) {
        if (typeof process !== "function") {
            return;
        }

        this._que.unshift(process);

        if (this._que.length > this._maxTask) {
            this._que.pop();
        }

        return this.start();
    }

    que(process) {
        if (typeof process !== "function") {
            return;
        }

        this._que.push(process);

        if (this._que.length > this._maxTask) {
            if (this._shiftOnOverTask) {
                this._que.shift();
            } else {
                this._que.pop();
            }
        }

        this.start();
    }

    start() {
        if (this._drainTick != null) {
            return;
        }

        this._drainTick = setInterval(() => { this._drainQue(); }, 10);
    }

    stop() {
        clearInterval(this._drainTick);
        this._drainTick = null;
    };

    _drainQue() {
        var inactiveWorker = _.find(this.workers, {working: false});

        if (inactiveWorker != null && this._que.length > 0) {
            let task = this._que.shift();
            inactiveWorker.process(task);
        }

        if (this._que.length === 0) {
            this.stop();
        }
    };
}
