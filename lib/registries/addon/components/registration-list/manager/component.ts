import Component from '@ember/component';
import { computed } from '@ember/object';

export default class RegistrationListManager extends Component {
    reloadSubmissionsList!: () => void;
    filterState!: string;

    @computed('filterState')
    get filterParams() {
        const query: Record<string, string> = {};
        query['filter[machine_state]'] = this.filterState || 'pending';
        // TODO: Add sorting params
        return query;
    }
}
