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

    institution?: InstitutionModel;

    departmentMetrics?: InstitutionDepartmentsModel[];

    // Private properties
    @tracked department = this.intl.t('institutions.dashboard.select_default');
    @tracked sort = 'user_name';

    reloadUserList?: () => void;

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
    onSelectChange(department: string) {
        this.department = department;
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }

    @action
    sortInstitutionalUsers(sortBy: string) {
        if (this.sort === sortBy) {
            // If the current sort is ascending, toggle to descending
            this.sort = `-${sortBy}`;
        } else if (this.sort === `-${sortBy}`) {
            // If the current sort is descending, toggle to ascending
            this.sort = sortBy;
        } else {
            // Set to descending if it's a new sort field
            this.sort = `-${sortBy}`;
        }
        if (this.reloadUserList) {
            this.reloadUserList();
        }
    }
}
