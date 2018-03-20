import { A } from '@ember/array';
import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';
import { Promise as EmberPromise } from 'rsvp';

interface ReadyHandle {
    id: number;
    finished: () => void;
    errored: (e: any) => void;
}

const READY_EVENT = 'ready';
const RESET_EVENT = 'reset';
const ERROR_EVENT = 'error';

export default class Ready extends Service.extend(Evented) {
    isReady = false;

    private lastId = 0;
    private pendingIds = A();

    private tryReady = task(function* (this: Ready) {
        // Wait for everyone in `render` and `afterRender` (e.g. components, jQuery plugins, etc.)
        // to have a chance to call `wait`, and make sure all DOM manipulation has settled.
        yield waitForQueue('destroy');
        if (!this.get('pendingIds.length')) {
            this.set('isReady', true);
            this.trigger(READY_EVENT);
        }
    }).drop();

    wait(this: Ready): ReadyHandle {
        if (this.get('isReady')) {
            return {
                id: null,
                finished: () => null,
                errored: () => null,
            };
        }
        const id = this.incrementProperty('lastId');
        const pending = this.get('pendingIds');
        pending.pushObject(id);
        return {
            id,
            finished: this.finishedCallback(id),
            errored: this.errorCallback(),
        };
    }

    reset(this: Ready): void {
        this.get('pendingIds').clear();
        this.set('isReady', false);
        this.trigger(RESET_EVENT);
    }

    ready(this: Ready) {
        return new EmberPromise((resolve, reject) => {
            this.on(READY_EVENT, resolve);
            this.on(RESET_EVENT, reject);
            this.on(ERROR_EVENT, reject);
        });
    }

    onReady(this: Ready, callback: () => void): void {
        this.on(READY_EVENT, callback);
    }

    onReset(this: Ready, callback: () => void): void {
        this.on(RESET_EVENT, callback);
    }

    onError(this: Ready, callback: () => void): void {
        this.on(ERROR_EVENT, callback);
    }

    private finishedCallback(this: Ready, id: int): void {
        return () => {
            const pending = this.get('pendingIds');
            pending.removeObject(id);
            if (!pending.length) {
                this.get('tryReady').perform();
            }
        };
    }

    private errorCallback(this: Ready): void {
        return (e: any) => {
            this.trigger(ERROR_EVENT, e);
        };
    }
}

declare module '@ember/service' {
    interface Registry {
        'ready': Ready;
    }
}
