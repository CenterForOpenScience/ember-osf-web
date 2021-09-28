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
        const filter: Record<string, string | undefined> = { review_state: this.state, revision_state: undefined };
        if (this.state === RegistrationReviewStates.Embargo) {
            filter.review_state =
                [RegistrationReviewStates.Embargo, RegistrationReviewStates.PendingEmbargoTermination].toString();
        }
        if (this.state === RevisionReviewStates.RevisionPendingModeration) {
            filter.revision_state = [RevisionReviewStates.RevisionPendingModeration].toString();
            filter.review_state = undefined;
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
