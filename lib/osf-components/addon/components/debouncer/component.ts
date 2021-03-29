import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class Debouncer extends Component {
    fn!: () => void;
    timeoutInterval: number = 500;

    @task({ withTestWaiter: true, restartable: true })
    doFnDebounce = task(function *(this: Debouncer) {
        yield timeout(this.timeoutInterval);
        yield this.fn();
    });

    didReceiveAttrs() {
        assert('Debouncer needs a function input', Boolean(this.fn));
    }
}
