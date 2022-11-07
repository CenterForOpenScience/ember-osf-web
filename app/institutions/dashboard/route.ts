import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import captureException from 'ember-osf-web/utils/capture-exception';

export interface InstitutionsDashboardModel {
    institution: InstitutionModel;
    departmentMetrics: InstitutionDepartmentModel[];
    summaryMetrics: InstitutionSummaryMetricModel;
}
export default class InstitutionsDashboardRoute extends Route {
    @service router!: RouterService;

    @task
    @waitFor
    async modelTask(institutionId: string) {
        try {
            const institution = await this.store.findRecord('institution', institutionId, {
                adapterOptions: {
                    include: ['summary_metrics'],
                },
            });
            const departmentMetrics = await institution.queryHasMany('departmentMetrics');
            const summaryMetrics = await institution.summaryMetrics;
            const userMetricInfo: QueryHasManyResult<never> = await institution.queryHasMany(
                'userMetrics',
                { size: 0 },
            );

            return {
                institution,
                departmentMetrics,
                summaryMetrics,
                totalUsers: userMetricInfo.meta.total,
            };
        } catch (error) {
            captureException(error);
            this.transitionTo('not-found', this.router.get('currentURL').slice(1));
            return undefined;
        }
    }

    // eslint-disable-next-line camelcase
    model(params: { institution_id: string }) {
        return {
            taskInstance: taskFor(this.modelTask).perform(params.institution_id),
        };
    }
}
