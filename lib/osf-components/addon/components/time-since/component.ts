import Component from '@ember/component';
import { assert } from '@ember/debug';
import { waitFor } from '@ember/test-waiters';
import Ember from 'ember';
import { restartableTask, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

import template from './template';

const interval = 30000; // every 30 seconds

@layout(template)
export default class TimeSince extends Component {
    // required arguments
    date!: Date;

    // Private properties
    displayTime?: string;

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async calculateRelativeTime() {
        assert('RelativeTime @date is required', Boolean(this.date));
        if (Ember.testing) {
            return;
        }
        // eslint-disable-next-line no-constant-condition
        while (true) {
            this.set('displayTime', formattedTimeSince(this.date));
            // eslint-disable-next-line no-await-in-loop
            await timeout(interval);
        }
    }
}
