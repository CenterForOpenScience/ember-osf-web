import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import I18N from 'ember-i18n/services/i18n';
import InstitutionModel from 'ember-osf-web/models/institution';
import Analytics from 'ember-osf-web/services/analytics';

export default class InstitutionalUsersList extends Component {
    @alias('model.taskInstance.value') institution?: InstitutionModel;
    @service analytics!: Analytics;
    @service i18n!: I18N;

    // Private properties
    department?: string;
    sort = 'user_full_name';

    @computed('i18n.locale')
    get defaultDepartment() {
        return this.i18n.t('institutions.dashboard.select_default');
    }

    @computed('defaultDepartment', 'institution')
    get departments() {
        let departments = [this.defaultDepartment];

        if (this.institution && this.institution.statSummary) {
            const institutionDepartments = this.institution.statSummary.departments.map((x: any) => x.name);
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
