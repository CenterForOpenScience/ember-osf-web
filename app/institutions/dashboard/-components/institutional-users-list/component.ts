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

interface Column {
    key: string;
    label: string;
    default: boolean;
}

interface InstitutionalUsersListArgs {
    institution: InstitutionModel;
    departmentMetrics: InstitutionDepartmentsModel[];
}

export default class InstitutionalUsersList extends Component<InstitutionalUsersListArgs> {
    @service analytics!: Analytics;
    @service intl!: Intl;

    institution?: InstitutionModel;

    departmentMetrics?: InstitutionDepartmentsModel[];

    // Private properties
    @tracked department = this.intl.t('institutions.dashboard.select_default');
    @tracked sort = 'user_name';
    @tracked selectedDepartments: string[] = [];
    @tracked isAllSelected = false;
    @tracked filteredUsers = [];
    @tracked columns: Column[] = [
        { key: 'user_name', label: this.intl.t('institutions.dashboard.users_list.name'), default: true },
        { key: 'department', label: this.intl.t('institutions.dashboard.users_list.department'), default: true },
        { key: 'osf_link', label: this.intl.t('institutions.dashboard.users_list.osf_link'), default: true },
        { key: 'public_projects', label: this.intl.t('institutions.dashboard.users_list.public_projects'), default: true },
        { key: 'private_projects', label: this.intl.t('institutions.dashboard.users_list.private_projects'), default: true },
        { key: 'public_registration_count', label: this.intl.t('institutions.dashboard.users_list.public_registration_count'), default: true },
        { key: 'private_registration_count', label: this.intl.t('institutions.dashboard.users_list.private_registration_count'), default: true },
        { key: 'published_preprint_count', label: this.intl.t('institutions.dashboard.users_list.published_preprint_count'), default: true },
        { key: 'public_file_count', label: this.intl.t('institutions.dashboard.users_list.public_file_count'), default: false },
        { key: 'storage_byte_count', label: this.intl.t('institutions.dashboard.users_list.storage_byte_count'), default: false },
        { key: 'account_creation_date', label: this.intl.t('institutions.dashboard.users_list.account_created'), default: false },
        { key: 'month_last_login', label: this.intl.t('institutions.dashboard.users_list.month_last_login'), default: false },
        { key: 'month_last_active', label: this.intl.t('institutions.dashboard.users_list.month_last_active'), default: false },
    ];

    @tracked selectedColumns: string[] = this.columns.filter(col => col.default).map(col => col.key);

    reloadUserList?: () => void;

    @action
    toggleColumnSelection(columnKey: string) {
        const column = this.columns.find(col => col.key === columnKey);
        if (column) {
            column.default = !column.default;
        }
    }

    get defaultDepartment() {
        return this.intl.t('institutions.dashboard.select_default');
    }

    get departments() {
        let departments = [this.defaultDepartment];

        if (this.args.institution && this.args.departmentMetrics) {
            const institutionDepartments = this.args.departmentMetrics.map((x: InstitutionDepartmentsModel) => x.name);
            departments = departments.concat(institutionDepartments);
        }
        return departments;
    }

    get isDefaultDepartment() {
        return this.department === this.defaultDepartment;
    }

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
            const depts: InstitutionDepartmentsModel[] = await this.args.institution.queryHasMany('departmentMetrics', {
                filter: {
                    name,
                },
            });
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
    onSelectChange(selectedDepartment) {
        this.department = selectedDepartment;
    }


    @action
    toggleAllDepartments(event: Event) {
        this.isAllSelected = (event.target as HTMLInputElement).checked;
        this.selectedDepartments = this.isAllSelected ? [...this.departments] : [];
    }

    @action
    applyDepartmentSelection() {
        if (this.selectedDepartments.length && !this.isAllSelected) {
            this.filteredUsers = this.args.departmentMetrics.filter(user =>
                this.selectedDepartments.includes(user.department));
        } else {
            this.filteredUsers = this.args.departmentMetrics;
        }

        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

    @action
    cancelSelection() {
        this.selectedDepartments = [];
        this.isAllSelected = false;
    }

    @action
    applyColumnSelection() {
        this.selectedColumns = this.columns.filter(col => col.default).map(col => col.key);
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

}
