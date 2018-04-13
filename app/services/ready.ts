import { A } from '@ember/array';
import { get, set } from '@ember/object';
import Evented from '@ember/object/evented';
import Service from '@ember/service';

import { task, waitForQueue } from 'ember-concurrency';
import RSVP from 'rsvp';

export interface Blocker {
    done: () => void;
    errored: (e: any) => void;
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

    tryReady = task(function* (this: Ready) {
        // Waiting until `destroy` makes sure that everyone in `render` and `afterRender`
        // (e.g. components, jQuery plugins, etc.) has a chance to call `getBlocker`, and that
        // all DOM manipulation has settled.
        yield waitForQueue('destroy');
        if (!get(this, 'blockers').length) {
            set(this, 'isReady', true);
            this.trigger(Events.IsReady);
        }
    }).drop();

    getBlocker(this: Ready): Blocker {
        if (get(this, 'isReady')) {
            return {
                done: () => null,
                errored: () => null,
            };
        }
        const id = this.incrementProperty('lastId');
        get(this, 'blockers').pushObject(id);
        return {
            done: this.doneCallback(id),
            errored: this.errorCallback(),
        };
    }

    ready(this: Ready) {
        return new RSVP.Promise((resolve, reject) => {
            this.on(Events.IsReady, resolve);
            this.on(Events.Reset, reject);
            this.on(Events.Error, reject);
        });
    }

    reset(this: Ready): void {
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
                get(this, 'tryReady').perform();
            }
        };
    }

    private errorCallback(this: Ready) {
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
