import Store from '@ember-data/store';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

export default class Discover extends Route {
    @service store!: Store;
    @service analytics!: Analytics;

    queryParams = {
        queryString: {
            replace: true,
        },
    };

    model() {
        return this.store.findAll('collection-provider', { reload: true });
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
