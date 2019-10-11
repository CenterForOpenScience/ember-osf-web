import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import translations from 'ember-osf-web/locales/en/translations';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionalUsersList extends Component {
    @alias('model.taskInstance.value') institution!: InstitutionModel;

    // Private properties
    department?: string;
    sort = '-userFullName';

    @computed('institution')
    get departments() {
        let departments = [translations.institutions.dashboard.select_default];

        if (this.institution) {
            const institutionDepartments = this.institution.statSummary.departments.map((x: any) => x.name);
            departments = departments.concat(institutionDepartments);
        }

        this.set('department', departments[0]);

        return departments;
    }

    @computed('department', 'departments')
    get isDefaultDepartment() {
        return this.department === this.get('departments')[0];
    }

    @computed('department', 'sort')
    get query() {
        const query = {} as Record<string, string>;
        if (this.department && !this.get('isDefaultDepartment')) {
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
