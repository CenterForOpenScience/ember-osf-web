import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';

import Controller from '@ember/controller';
import { InstitutionsDashboardModel } from 'ember-osf-web/institutions/dashboard/route';
import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentModel from 'ember-osf-web/models/institution-department';
import InstitutionSummaryMetricModel from 'ember-osf-web/models/institution-summary-metric';
import InstitutionUserModel from 'ember-osf-web/models/institution-user';

export default class InstitutionsDashboardController extends Controller {
    @alias('model.taskInstance.value') modelValue?: InstitutionsDashboardModel;
    @alias('modelValue.institution') institution?: InstitutionModel;
    @alias('modelValue.summaryMetrics') summaryMetrics?: InstitutionSummaryMetricModel;
    @alias('modelValue.departmentMetrics') departmentMetrics?: InstitutionDepartmentModel[];

    csvImgSrc: string = '/assets/images/institutions/csv.svg';

    @computed('institution')
    get totalUsers(): number {
        const userMetrics = this.institution.queryHasMany('userMetrics');
    }

    @computed('institution.lastUpdated')
    get lastUpdatedFromNow(): string {
        const lastUpdated = this.institution ? moment(this.institution.lastUpdated) : moment();
        return lastUpdated.fromNow();
    }

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
}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}
