import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import translations from 'ember-osf-web/locales/en/translations';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionalUsersList extends Component {
    @alias('model.taskInstance.value') institution!: InstitutionModel;

    // Private properties
    department?: string;
    sort = '-name';

    @computed('institution')
    get departments() {
        let departments = [translations.institutions.dashboard.select_default];

        if (this.institution) {
            const institutionDepartments = this.institution.statSummary.departments.map((x: any) => x.name);
            departments = departments.concat(institutionDepartments);
        }

        return departments;
    }

    @computed('department', 'sort')
    get query() {
        const query = {} as Record<string, string>;
        if (this.department) {
            query['filter[department]'] = this.department;
        }
        if (this.sort) {
            query.sort = this.sort;
        }
        return query;
    }

    @action
    onSelectChange(department: any) {
        this.set('department', department.value);
    }

    @action
    sortInstitutionalUsers(sort: string) {
        this.set('sort', sort);
    }
}
