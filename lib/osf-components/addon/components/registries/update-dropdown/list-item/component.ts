import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

interface Args {
    registration: RegistrationModel;
    revision: SchemaResponseModel;
    isModeratorMode: boolean;
    index: number;
    totalRevisions: number;
}

export default class ListItem extends Component<Args> {
    @service intl!: Intl;

    get shouldShow() {
        const { registration, revision, isModeratorMode } = this.args;
        if ([RegistrationReviewStates.Pending, RegistrationReviewStates.Initial].includes(registration.reviewsState)
        && revision.isOriginalResponse) {
            return true;
        }
        if (isModeratorMode) {
            return [RevisionReviewStates.RevisionPendingModeration,
                RevisionReviewStates.Approved].includes(revision.reviewsState);
        }
        return revision.reviewsState === RevisionReviewStates.Approved;
    }
}
