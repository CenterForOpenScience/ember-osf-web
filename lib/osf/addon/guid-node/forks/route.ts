import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Analytics from 'ember-osf-web/services/analytics';
import Ready from 'ember-osf-web/services/ready';

export default class GuidNodeForks extends Route {
    @service analytics!: Analytics;
    @service ready!: Ready;

    model(this: GuidNodeForks) {
        return this.modelFor('guid-node');
    }

    @action
    didTransition() {
        this.analytics.trackPage(true);
    }
}
