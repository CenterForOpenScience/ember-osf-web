import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

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
    @service store!: Store;

    // eslint-disable-next-line camelcase
    async model(params: { institution_id: string }) {
        try {
            const institution = await this.store.findRecord('institution', params.institution_id, {
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
}
