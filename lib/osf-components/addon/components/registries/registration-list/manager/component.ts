import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { layout } from 'ember-osf-web/decorators/component';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import template from './template';

@layout(template)
export default class RegistrationListManager extends Component {
    reloadRegistrationsList!: () => void;
    state!: RegistrationReviewStates | string;

    sort = '-date_registered';

    @computed('state', 'sort')
    get filterParams() {
        const filter: Record<string, string | undefined> = { reviews_state: this.state, revision_state: undefined };
        if (this.state === RegistrationReviewStates.Embargo) {
            filter.reviews_state =
                [RegistrationReviewStates.Embargo, RegistrationReviewStates.PendingEmbargoTermination].join();
        }
        if (this.state === RevisionReviewStates.RevisionPendingModeration) {
            filter.revision_state = [RevisionReviewStates.RevisionPendingModeration].join();
            filter.reviews_state = [RegistrationReviewStates.Embargo, RegistrationReviewStates.Accepted].join();
        }
        const query: Record<string, string | Record<string, string | undefined>> = {
            filter,
            sort: this.sort,
        };

        return query;
    }

    @action
    sortRegistrationsBy(sort: string) {
        this.set('sort', sort);
    }
}
