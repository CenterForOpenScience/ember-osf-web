import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency-decorators';
import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionsDashboardRoute extends Route {
    @service analytics!: Analytics;

    @service router!: RouterService;

    @task
    modelTask = task(function *(this: InstitutionsDashboardRoute, institutionId: string) {
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

    // eslint-disable-next-line camelcase
    model(params: { institution_id: string }) {
        return {
            taskInstance: this.modelTask.perform(params.institution_id),
        };
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
