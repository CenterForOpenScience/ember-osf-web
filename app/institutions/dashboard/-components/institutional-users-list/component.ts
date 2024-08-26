import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, TaskInstance, timeout } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';

import { InstitutionsDashboardModel } from 'ember-osf-web/institutions/dashboard/route';
import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';
import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionalUsersList extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;

    @reads('modelTaskInstance.value.institution')
    institution?: InstitutionModel;

    @reads('modelTaskInstance.value.departmentMetrics')
    departmentMetrics?: InstitutionDepartmentsModel[];

    // Private properties
    modelTaskInstance!: TaskInstance<InstitutionsDashboardModel>;
    department = this.intl.t('institutions.dashboard.select_default');
    sort = 'user_name';

    reloadUserList?: () => void;

    @computed('intl.locale')
    get defaultDepartment() {
        return this.intl.t('institutions.dashboard.select_default');
    }

    @computed('defaultDepartment', 'department', 'departmentMetrics.[]', 'institution')
    get departments() {
        let departments = [this.defaultDepartment];

        if (this.institution && this.departmentMetrics) {
            const institutionDepartments = this.departmentMetrics.map((x: InstitutionDepartmentsModel) => x.name);
            departments = departments.concat(institutionDepartments);
        }
        return departments;
    }

    @computed('defaultDepartment', 'department')
    get isDefaultDepartment() {
        return this.department === this.defaultDepartment;
    }

    @computed('department', 'isDefaultDepartment', 'sort')
    get queryUsers() {
        const query = {} as Record<string, string>;
        if (this.department && !this.isDefaultDepartment) {
            query['filter[department]'] = this.department;
        }
        if (this.sort) {
            query.sort = this.sort;
        }
        return query;
    }

    @restartableTask
    @waitFor
    async searchDepartment(name: string) {
        await timeout(500);
        if (this.institution) {
            const depts: InstitutionDepartmentsModel[] = await this.institution.queryHasMany('departmentMetrics', {
                filter: {
                    name,
                },
            });
            return depts.map(dept => dept.name);
        }
        return [];
    }

    @action
    onSelectChange(department: string) {
        this.analytics.trackFromElement(this.element, {
            name: 'Department Select - Change',
            category: 'select',
            action: 'change',
        });
        this.set('department', department);
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

    @action
    sortInstitutionalUsers(sortBy: string) {
        if (this.sort === sortBy) {
            // If the current sort is the same, toggle the order
            this.set('sort', `-${sortBy}`);
        } else if (this.sort === `-${sortBy}`) {
            // If the current sort is already descending, toggle to ascending
            this.set('sort', sortBy);
        } else {
            // Set to ascending if it's a new sort field
            this.set('sort', sortBy);
        }
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

}
