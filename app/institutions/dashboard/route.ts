import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import { task } from 'ember-concurrency';
import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionsDashboardRoute extends Route {
    @service analytics!: Analytics;
    @service router!: any;

    loadInstitutionsDashboardRoute = task(function *(this: InstitutionsDashboardRoute, institutionId: string) {
        try {
            const institution = yield this.get('store').findRecord('institution', institutionId);
            if (!institution.get('currentUserIsAdmin')) {
                throw new Error('Current user is not admin.');
            }
            return institution;
        } catch (error) {
            this.transitionTo('not-found', this.get('router').get('currentURL').slice(1));
            return undefined;
        }
    });

    // TODO Will need to check user permission to access institutional dashboard
    model(this: InstitutionsDashboardRoute, params: Record<string, string>) {
        return {
            taskInstance: this.get('loadInstitutionsDashboardRoute').perform(params.institution_id),
        };
    }

    @action
    didTransition() {
        this.get('analytics').trackPage();
    }
}
