import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';

import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionsDashboardRoute extends Route.extend({
    modelTask: task(function *(this: InstitutionsDashboardRoute, institutionId: string) {
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
    }),
}) {
    @service analytics!: Analytics;
    @service router!: RouterService;

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
