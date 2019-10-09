import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import InstitutionModel from 'ember-osf-web/models/institution';

export default class InstitutionalUsersList extends Component {
    model!: InstitutionModel;

    // Private properties
    department?: string;
    sort = '-name';

    @computed('modelInstance')
    get departments() {
        // const departments = this.get('model').get('institutionalUsers').map(x => x.department);
        // return new Set(departments);
        return ['Biology', 'World'];
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
    onSelectChange(value: string) {
        this.set('department', value);
    }

    @action
    sortInstitutionalUsers(sort: string) {
        this.set('sort', sort);
    }
}
