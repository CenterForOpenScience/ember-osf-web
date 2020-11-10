import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';

export default class RegistrationListManager extends Component {
    reloadRegistrationsList!: () => void;
    filterState!: RegistrationReviewStates | string;

    sort: string = 'date_registered';

    @computed('filterState', 'sort')
    get filterParams() {
        let filter = this.filterState;
        if (this.filterState === RegistrationReviewStates.Embargo) {
            filter = [RegistrationReviewStates.Embargo, RegistrationReviewStates.PendingEmbargoTermination].toString();
        }
        const query: Record<string, string | Record<string, string>> = {
            filter: { reviews_state: filter || 'pending' },
            sort: this.sort,
        };

        return query;
    }

    @action
    sortRegistrationsBy(sort: string) {
        this.set('sort', sort);
    }
}
