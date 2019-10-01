import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionsDashboardRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    // eslint-disable-next-line camelcase
    model(params: { institution_id: string }) {
        return this.store.findRecord('institution', params.institution_id);
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
