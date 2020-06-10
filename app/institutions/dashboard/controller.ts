import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import Controller from '@ember/controller';
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

    csvImgSrc: string = '/assets/images/institutions/csv.svg';

    // TODO: add csv link back when ENG-1810 is done
    @computed('institution.links.csv')
    get csvHref() {
        // return this.institution ? this.institution.links.csv : '#';
        return '#';
    }

    @action
    onCsvButtonMouseEnter() {
        this.set('csvImgSrc', '/assets/images/institutions/csv-hover.svg');
    }

    @action
    onCsvButtonMouseLeave() {
        this.set('csvImgSrc', '/assets/images/institutions/csv.svg');
    }

    @action
    async downloadCsv() {
        const url = this.institution!.hasMany('userMetrics').link();
        const csvData = await this.currentUser.authenticatedAJAX({
            url,
            headers: { Accept: 'text/csv' },
        });
        console.log({ url, csvData });
        const csvBlob = new Blob(csvData, { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        window.open(csvUrl, '_blank');
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}
