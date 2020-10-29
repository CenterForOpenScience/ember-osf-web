import { A } from '@ember/array';
import { get, set } from '@ember/object';
import Evented from '@ember/object/evented';
import Service from '@ember/service';

import { waitForQueue } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import RSVP from 'rsvp';

export interface Blocker {
    done(): void;
    errored(e: any): void;
    isDone(): boolean;
}

export enum Events {
    IsReady = 'ready',
    Reset = 'reset',
    Error = 'error',
}

export default class Ready extends Service.extend(Evented) {
    isReady = false;

    lastId = 0;
    blockers = A();

    @restartableTask({ withTestWaiter: true })
    async tryReady() {
        // Waiting until `destroy` makes sure that everyone in `render` and `afterRender`
        // (e.g. components, jQuery plugins, etc.) has a chance to call `getBlocker`, and that
        // all DOM manipulation has settled.
        await waitForQueue('destroy');
        if (!get(this, 'blockers').length) {
            set(this, 'isReady', true);
            this.trigger(Events.IsReady);
        }
    }

    getBlocker(): Blocker {
        if (get(this, 'isReady')) {
            return {
                done: () => null,
                errored: () => null,
                isDone: () => true,
            };
        }
        const id = this.incrementProperty('lastId');
        get(this, 'blockers').pushObject(id);
        return {
            done: this.doneCallback(id),
            errored: this.errorCallback(),
            isDone: () => !this.blockers.includes(id),
        };
    }

    ready() {
        if (this.isReady) {
            return RSVP.resolve();
        }
        return new RSVP.Promise((resolve, reject) => {
            this.on(Events.IsReady, resolve);
            this.on(Events.Reset, reject);
            this.on(Events.Error, reject);
        });
    }

    reset(): void {
        // Invalidate all prior blockers
        get(this, 'blockers').clear();
        set(this, 'isReady', false);
        this.trigger(Events.Reset);
    }

    private doneCallback(this: Ready, id: number) {
        return () => {
            const blockers = get(this, 'blockers');
            blockers.removeObject(id);
            if (!blockers.length) {
                taskFor(get(this, 'tryReady')).perform();
            }
        };
    }

    private errorCallback() {
        return (e: any) => {
            this.trigger(Events.Error, e);
        };
    }
}

declare module '@ember/service' {
    interface Registry {
        'ready': Ready;
    }
}
