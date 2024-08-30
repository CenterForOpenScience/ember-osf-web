import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';

import InstitutionModel from 'ember-osf-web/models/institution';
import InstitutionDepartmentsModel from 'ember-osf-web/models/institution-department';
import Analytics from 'ember-osf-web/services/analytics';

interface InstitutionalUsersListArgs {
    institution: InstitutionModel;
    departmentMetrics: InstitutionDepartmentsModel[];
}

export default class InstitutionalUsersList extends Component<InstitutionalUsersListArgs> {
    @service analytics!: Analytics;
    @service intl!: Intl;

    @tracked department = this.intl.t('institutions.dashboard.select_default');
    @tracked sort = 'user_name';
    @tracked selectedDepartments: string[] = [];
    @tracked isAllSelected = false;
    @tracked filteredUsers = [];

    reloadUserList?: () => void;

    get defaultDepartment() {
        return this.intl.t('institutions.dashboard.select_default');
    }

    get departments() {
        const departments = [];
        if (this.args.institution && this.args.departmentMetrics) {
            const institutionDepartments = this.args.departmentMetrics.map(
                (dept: InstitutionDepartmentsModel) => dept.name,
            );
            return departments.concat(institutionDepartments);
        }
        return departments;
    }

    get isDefaultDepartment() {
        return this.department === this.defaultDepartment;
    }

    get queryUsers() {
        const query = {} as Record<string, string>;
        if (this.selectedDepartments.length && !this.isAllSelected) {
            query['filter[department]'] = this.selectedDepartments.join(',');
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
        if (this.args.institution) {
            const depts: InstitutionDepartmentsModel[] = await this.args.institution.queryHasMany(
                'departmentMetrics',
                {
                    filter: { name },
                },
            );
            return depts.map(dept => dept.name);
        }
        return [];
    }

    @action
    sortInstitutionalUsers(sortBy: string) {
        if (this.sort === sortBy) {
            this.sort = `-${sortBy}`; // Toggle to descending
        } else if (this.sort === `-${sortBy}`) {
            this.sort = sortBy; // Toggle to ascending
        } else {
            this.sort = `-${sortBy}`; // New field, default to descending
        }
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

    @action
    toggleDepartmentSelection(department: string) {
        if (this.selectedDepartments.includes(department)) {
            this.selectedDepartments = this.selectedDepartments.filter(d => d !== department);
        } else {
            this.selectedDepartments = [...this.selectedDepartments, department];
        }
    }

    @action
    toggleAllDepartments(event: Event) {
        this.isAllSelected = (event.target as HTMLInputElement).checked;
        this.selectedDepartments = this.isAllSelected ? [...this.departments] : [];
    }

    @action
    applyDepartmentSelection() {
        // Update the filtered users list based on the selected departments
        if (this.selectedDepartments.length && !this.isAllSelected) {
            this.filteredUsers = this.args.departmentMetrics.filter(user =>
                this.selectedDepartments.includes(user.department)
            );
        } else {
            this.filteredUsers = this.args.departmentMetrics; // Show all users if all departments are selected
        }

        // Trigger any additional actions such as reloading data or notifying the parent component
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

    @action
    cancelSelection() {
        this.selectedDepartments = [];
        this.isAllSelected = false;
    }
}
