import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class RegistrationListManager extends Component {
    reloadRegistrationsList!: () => void;
    filterState!: string;

    sort: string = 'date_registered';

    @computed('filterState', 'sort')
    get filterParams() {
        const filter = this.filterState;
        // TODO: commented out while using mirage. uncomment this when testing with real backend
        // if (this.filterState === 'pending') {
        //     filter = 'pending,embargo';
        // }
        const query: Record<string, string | Record<string, string>> = {
            filter: { reviews_state: this.filterState || 'pending' },
            sort: this.sort,
        };

        return query;
    }

    @action
    sortRegistrationsBy(sort: string) {
        this.set('sort', sort);
    }
}
