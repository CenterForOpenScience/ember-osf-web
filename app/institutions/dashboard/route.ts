import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import Analytics from 'ember-osf-web/services/analytics';
import captureException from 'ember-osf-web/utils/capture-exception';

export interface InstitutionsDashboardModel {
    institution: InstitutionModel;
    departmentMetrics: InstitutionDepartmentModel[];
    summaryMetrics: InstitutionSummaryMetricModel;
}
export default class InstitutionsDashboardRoute extends Route {
    @service analytics!: Analytics;
    @service router!: RouterService;

    @task
    modelTask = task(function *(this: InstitutionsDashboardRoute, institutionId: string) {
        try {
            const institution = yield this.get('store').findRecord('institution', institutionId, {
                adapterOptions: {
                    include: ['summary_metrics'],
                },
            });
            const departmentMetrics = yield institution.queryHasMany('departmentMetrics'); // ordering = ('-number_of_users', 'name’,) <<< is this true??
            const summaryMetrics = yield institution.summaryMetrics;
            return { institution, departmentMetrics, summaryMetrics };
        } catch (error) {
            captureException(error);
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
