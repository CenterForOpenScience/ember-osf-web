import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class Debouncer extends Component {
    fn!: () => void;
    timeoutInterval!: number;

    @task({ restartable: true })
    doFnDebounce = task(function *(this: Debouncer) {
        yield timeout(this.timeoutInterval);
        try {
            yield this.fn();
        } catch (error) {
            throw error;
        }
    });

    @action
    doFnNow() {
        this.fn();
    }

    didReceiveAttrs() {
        assert('Debouncer needs a function input', Boolean(this.fn));
        assert('Debouncer needs a timeout interval', Boolean(this.timeoutInterval));
    }
}
