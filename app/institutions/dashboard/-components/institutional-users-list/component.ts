import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionalUsersList extends Component {
    @alias('model.taskInstance.value') institution!: InstitutionModel;

    // Private properties
    @service i18n!: I18N;
    department?: string;
    sort = 'user_full_name';

    @computed('i18n.locale')
    get defaultDepartment() {
        return this.i18n.t('institutions.dashboard.select_default');
    }

    @computed('institution')
    get departments() {
        let departments = [this.defaultDepartment];

        if (this.institution) {
            const institutionDepartments = this.institution.statSummary.departments.map((x: any) => x.name);
            departments = departments.concat(institutionDepartments);
        }

        if (!this.department) {
            this.set('department', departments[0]);
        }

        return departments;
    }

    @computed('department', 'departments')
    get isDefaultDepartment() {
        return this.department === this.defaultDepartment;
    }

    @computed('department', 'sort')
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
        this.set('department', department);
    }

    @action
    sortInstitutionalUsers(sort: string) {
        this.set('sort', sort);
    }
}
