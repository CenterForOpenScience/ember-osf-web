import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

interface Args {
    revision: SchemaResponseModel;
    isModeratorMode: boolean;
    index: number;
    totalRevisions: number;
    isAnonymous: boolean;
}

export default class ListItem extends Component<Args> {
    @service intl!: Intl;

    get shouldShow() {
        const { revision, isModeratorMode, isAnonymous} = this.args;
        const visibleStates = [RevisionReviewStates.Approved];
        if (isModeratorMode) {
            visibleStates.push(RevisionReviewStates.RevisionPendingModeration);
        }
        return revision.isOriginalResponse || isAnonymous || visibleStates.includes(revision.reviewsState);
    }
}
