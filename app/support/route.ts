import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import Analytics from 'ember-osf-web/services/analytics';

export default class Support extends Route {
    @service analytics!: Analytics;

    @action
    didTransition(this: Support) {
        this.analytics.trackPage();
    }
}
