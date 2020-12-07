import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';

export default class RegistrationListManager extends Component {
    reloadRegistrationsList!: () => void;
    state!: RegistrationReviewStates | string;

    sort: string = '-date_registered';

    @computed('state', 'sort')
    get filterParams() {
        let filter = this.state;
        if (this.state === RegistrationReviewStates.Embargo) {
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
