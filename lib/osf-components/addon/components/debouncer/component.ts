import Component from '@ember/component';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, Task, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class Debouncer extends Component {
    fn!: Task<void, []>;
    timeoutInterval: number = 500;

    @restartableTask
    @waitFor
    async doFnDebounce() {
        await timeout(this.timeoutInterval);
        await this.fn.perform();
    }

    didReceiveAttrs() {
        assert('Debouncer needs a function input', Boolean(this.fn));
    }
}
