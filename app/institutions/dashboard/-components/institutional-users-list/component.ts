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
  value: boolean;
  label: string;
  type: 'string' | 'date_by_month' | 'osf_link' | 'user_name';
}

interface InstitutionalUsersListArgs {
  institution: InstitutionModel;
  departmentMetrics: InstitutionDepartmentsModel[];
}

export default class InstitutionalUsersList extends Component<InstitutionalUsersListArgs> {
  @service analytics!: Analytics;
  @service intl!: Intl;

  // Properties
  @tracked department = this.defaultDepartment;
  @tracked sort = 'user_name';
  @tracked selectedDepartments: string[] = [];
  @tracked selectedColumns: string[] = this.defaultSelectedColumns;
  @tracked filteredUsers = [];

  @tracked columns: Column[] = [
      {
          key: 'user_name',
          sort_key: 'user_name',
          label: this.intl.t('institutions.dashboard.users_list.name'),
          value: true,
          type: 'user_name',
      },
      {
          key: 'department',
          sort_key: 'department',
          label: this.intl.t('institutions.dashboard.users_list.department'),
          value: true,
          type: 'string',
      },
      {
          key: 'osf_link',
          sort_key: false,
          label: this.intl.t('institutions.dashboard.users_list.osf_link'),
          value: true,
          type: 'osf_link',
      },
      {
          key: 'publicProjects',
          sort_key: 'public_projects',
          label: this.intl.t('institutions.dashboard.users_list.public_projects'),
          value: true,
          type: 'string',
      },
      {
          key: 'privateProjects',
          sort_key: 'private_projects',
          label: this.intl.t('institutions.dashboard.users_list.private_projects'),
          value: true,
          type: 'string',
      },
      {
          key: 'publicRegistrationCount',
          sort_key: 'public_registration_count',
          label: this.intl.t('institutions.dashboard.users_list.public_registration_count'),
          value: true,
          type: 'string',
      },
      {
          key: 'embargoedRegistrationCount',
          sort_key: 'embargoed_registration_count',
          label: this.intl.t('institutions.dashboard.users_list.private_registration_count'),
          value: true,
          type: 'string',
      },
      {
          key: 'publishedPreprintCount',
          sort_key: 'published_preprint_count',
          label: this.intl.t('institutions.dashboard.users_list.published_preprint_count'),
          value: true,
          type: 'string',
      },
      {
          key: 'publicFileCount',
          sort_key: 'public_file_count',
          label: this.intl.t('institutions.dashboard.users_list.public_file_count'),
          value: false,
          type: 'string',
      },
      {
          key: 'userDataUsage',
          sort_key: 'storage_byte_count',
          label: this.intl.t('institutions.dashboard.users_list.storage_byte_count'),
          value: false,
          type: 'string',
      },
      {
          key: 'accountCreationDate',
          sort_key: 'account_creation_date',
          label: this.intl.t('institutions.dashboard.users_list.account_created'),
          value: false,
          type: 'date_by_month',
      },
      {
          key: 'monthLastLogin',
          sort_key: 'month_last_login',
          label: this.intl.t('institutions.dashboard.users_list.month_last_login'),
          value: false,
          type: 'date_by_month',
      },
      {
          key: 'monthLastActive',
          sort_key: 'month_last_active',
          label: this.intl.t('institutions.dashboard.users_list.month_last_active'),
          value: false,
          type: 'date_by_month',
      },
  ];

  @tracked selectedColumns: string[] = this.columns.filter(col => col.value).map(col => col.key);

  reloadUserList?: () => void;

  @action
  toggleColumnSelection(columnKey: string) {
      const column = this.columns.find(col => col.key === columnKey);
      if (column) {
          column.value = !column.value;
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

  get filteredColumns() {
      return this.columns.filter(column => this.selectedColumns.includes(column.key));
  }

  @restartableTask
  @waitFor
  async searchDepartment(name: string) {
      await timeout(500);
      if (this.institution) {
          const depts: InstitutionDepartmentsModel[] = await this.args.institution.queryHasMany('departmentMetrics', {
              filter: { name },
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
  }

  @action
  cancelSelection() {
      this.selectedDepartments = [];
      this.isAllSelected = false;
  }

  @action
  applyColumnSelection() {
      this.selectedColumns = this.columns.filter(col => col.value).map(col => col.key);
  }
}
