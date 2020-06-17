import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import { InstitutionsDashboardModel } from 'ember-osf-web/institutions/dashboard/route';
import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import CurrentUser from 'ember-osf-web/services/current-user';
import { addQueryParam } from 'ember-osf-web/utils/url-parts';

export default class InstitutionsDashboardController extends Controller {
    @service currentUser!: CurrentUser;

    @alias('model.taskInstance.value') modelValue?: InstitutionsDashboardModel;
    @alias('modelValue.institution') institution?: InstitutionModel;
    @alias('modelValue.summaryMetrics') summaryMetrics?: InstitutionSummaryMetricModel;
    @alias('modelValue.departmentMetrics') departmentMetrics?: InstitutionDepartmentModel[];
    @alias('modelValue.totalUsers') totalUsers?: number;

    @computed('institution')
    get csvHref(): string {
        const { institution } = this;
        if (institution) {
            const url = institution.hasMany('userMetrics').link();
            return addQueryParam(url, 'format', 'csv');
        }
        return '';
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}
