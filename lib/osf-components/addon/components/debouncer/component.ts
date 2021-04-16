import Component from '@ember/component';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class Debouncer extends Component {
    fn!: () => Promise<void>;
    timeoutInterval: number = 500;

    @restartableTask
    @waitFor
    async doFnDebounce() {
        await timeout(this.timeoutInterval);
        await this.fn();
    }

    didReceiveAttrs() {
        assert('Debouncer needs a function input', Boolean(this.fn));
    }
}
