import Store from '@ember-data/store';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

export default class Institutions extends Route {
    @service analytics!: Analytics;
    @service store!: Store;

    model() {
        return this.store.findAll('institution');
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
