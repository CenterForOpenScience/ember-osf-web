import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

import { InstitutionsDashboardModel } from 'ember-osf-web/institutions/dashboard/route';
import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class InstitutionsDashboardController extends Controller {
    @service currentUser!: CurrentUser;

    @alias('model.taskInstance.value') modelValue?: InstitutionsDashboardModel;
    @alias('modelValue.institution') institution?: InstitutionModel;
    @alias('modelValue.summaryMetrics') summaryMetrics?: InstitutionSummaryMetricModel;
    @alias('modelValue.departmentMetrics') departmentMetrics?: InstitutionDepartmentModel[];
    @alias('modelValue.totalUsers') totalUsers?: number;

    @task({ drop: true })
    downloadCsv = task(function *(this: InstitutionsDashboardController) {
        const url = this.institution!.hasMany('userMetrics').link();
        const csvData = yield this.currentUser.authenticatedAJAX({
            url,
            headers: { Accept: 'text/csv' },
        });
        const csvBlob = new Blob(
            [csvData],
            { type: 'text/csv' },
        );
        const csvUrl = URL.createObjectURL(csvBlob);
        window.open(csvUrl, '_blank');
    });
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}
