import { A } from '@ember/array';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';

export default class Prerender extends Service {
    pending = A();

    ready = task(function* () {
        yield waitForQueue('afterRender');
        if (!this.get('pending.length')) {
            window.prerenderReady = true;
        }
    }).drop();

    waitOn(this: Prerender, key: string): void {
        if (window.prerenderReady) {
            return;
        }
        const pending = this.get('pending');
        assert('Already waiting on that key', !pending.includes(key));
        pending.pushObject(key);
    }

    finished(this: Prerender, key: string): void {
        if (window.prerenderReady) {
            return;
        }
        const pending = this.get('pending');
        assert('Call `waitOn` before `finished`', pending.includes(key));
        pending.removeObject(key);
        if (!pending.length) {
            this.get('ready').perform();
        }
    }
}

declare module '@ember/service' {
    interface Registry {
        'prerender': Prerender;
    }
}
