import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';

export default class BrandedModeratedOverviewRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    model(params: { providerId: string, guid: string }) {
        return {
            provider: this.modelFor('branded'),
            registration: this.store.findRecord('registration', params.guid),
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
