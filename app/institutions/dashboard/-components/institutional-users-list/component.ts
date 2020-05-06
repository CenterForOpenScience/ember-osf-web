import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';

import { InstitutionsDashboardModel } from 'ember-osf-web/institutions/dashboard/route';
import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';
import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionalUsersList extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;

    // Private properties
    modelTaskInstance!: TaskInstance<InstitutionsDashboardModel>;
    departmentMetrics?: InstitutionDepartmentsModel[];
    department?: string;
    institution!: InstitutionModel;
    sort = 'user_name';

    @task({ on: 'init' })
    loadDepartmentMetrics = task(function *(this: InstitutionalUsersList) {
        const modelValue = yield this.modelTaskInstance;
        const { institution } = modelValue;
        this.set('institution', institution);
        const deptMetrics = yield modelValue.departmentMetrics;
        this.set('departmentMetrics', deptMetrics.toArray());
    });

    @computed('intl.locale')
    get defaultDepartment() {
        return this.intl.t('institutions.dashboard.select_default');
    }

    @computed('defaultDepartment', 'institution', 'departmentMetrics.[]')
    get departments() {
        let departments = [this.defaultDepartment];

        if (this.institution && this.departmentMetrics) {
            const institutionDepartments = this.departmentMetrics.map((x: InstitutionDepartmentsModel) => x.name);
            departments = departments.concat(institutionDepartments);
        }

        if (!this.department) {
            this.set('department', departments[0]);
        }

        return departments;
    }

    @computed('defaultDepartment', 'department')
    get isDefaultDepartment() {
        return this.department === this.defaultDepartment;
    }

    @computed('department', 'isDefaultDepartment', 'sort')
    get query() {
        const query = {} as Record<string, string>;
        if (this.department && !this.isDefaultDepartment) {
            query['filter[department]'] = this.department;
        }
        if (this.sort) {
            query.sort = this.sort;
        }
        return query;
    }

    @action
    onSelectChange(department: string) {
        this.analytics.trackFromElement(this.element, {
            name: 'Department Select - Change',
            category: 'select',
            action: 'change',
        });
        this.set('department', department);
    }

    @action
    sortInstitutionalUsers(sort: string) {
        this.set('sort', sort);
    }
}
