import { A } from '@ember/array';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { task, waitForQueue } from 'ember-concurrency';

export default class Prerender extends Service {
    private pending = A();

    private ready = task(function* () {
        // Wait until any DOM manipulation in `afterRender` is definitely finished
        yield waitForQueue('destroy');
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
