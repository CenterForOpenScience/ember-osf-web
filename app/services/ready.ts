import { A } from '@ember/array';
import { Evented } from '@ember/object';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';

interface ReadyHandle {
    id: number;
    finished: () => void;
}

const READY_EVENT = 'ready';
const RESET_EVENT = 'reset';

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
            };
        }
        const id = this.incrementProperty('lastId');
        const pending = this.get('pendingIds');
        pending.pushObject(id);
        return {
            id,
            finished: this.finishedCallback(id),
        };
    }

    onReady(this: Ready, callback: () => void, autoReset: boolean = false): void {
        this.on(READY_EVENT, () => {
            callback();
            if (autoReset) {
                this.reset();
            }
        });
    }

    onReset(this: Ready, callback: () => void): void {
        this.on(RESET_EVENT, callback);
    }

    reset(this: Ready): void {
        this.get('pendingIds').clear();
        this.set('isReady', false);
        this.trigger(RESET_EVENT);
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
}

declare module '@ember/service' {
    interface Registry {
        'ready': Ready;
    }
}
