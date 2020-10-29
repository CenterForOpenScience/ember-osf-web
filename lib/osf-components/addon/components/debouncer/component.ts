import Component from '@ember/component';
import { assert } from '@ember/debug';
import { timeout } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
export default class Debouncer extends Component {
    fn!: () => void;
    timeoutInterval: number = 500;

    @restartableTask({ withTestWaiter: true })
    async doFnDebounce() {
        await timeout(this.timeoutInterval);
        await this.fn();
    }

    didReceiveAttrs() {
        assert('Debouncer needs a function input', Boolean(this.fn));
    }
}
