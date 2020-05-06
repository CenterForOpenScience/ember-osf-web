import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import InstitutionUserModel from 'ember-osf-web/models/institution-user';
import Analytics from 'ember-osf-web/services/analytics';

export interface InstitutionsDashboardModel {
    institution: InstitutionModel;
    departmentMetrics: InstitutionDepartmentModel;
    userMetrics: InstitutionUserModel;
    summaryMetrics: InstitutionSummaryMetricModel;
}
export default class InstitutionsDashboardRoute extends Route {
    @service analytics!: Analytics;
    @service router!: RouterService;

    @task
    modelTask = task(function *(this: InstitutionsDashboardRoute, institutionId: string) {
        try {
            const institution = yield this.get('store').findRecord('institution', institutionId, {
                adaptorOptions: {
                    include: ['summary_metrics'],
                },
            });
            const departmentMetrics = yield institution.get('departmentMetrics');
            const userMetrics = yield institution.get('userMetrics');
            const summaryMetrics = yield institution.get('summaryMetrics');
            // if (!institution.get('currentUserIsAdmin')) {
            //     throw new Error('Current user is not admin.');
            // }
            return { institution, departmentMetrics, userMetrics, summaryMetrics };
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
