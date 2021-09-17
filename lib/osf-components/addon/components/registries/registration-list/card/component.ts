import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Toast from 'ember-toastr/services/toast';

import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RevisionModel, { RevisionReviewStates } from 'ember-osf-web/models/revision';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

const iconMap: Partial<Record<RegistrationReviewStates | RevisionReviewStates.RevisionPendingModeration, string>> = {
    [RegistrationReviewStates.Pending]: 'hourglass',
    [RegistrationReviewStates.Withdrawn]: 'ban',
    [RegistrationReviewStates.Accepted]: 'check',
    [RegistrationReviewStates.Rejected]: 'times',
    [RegistrationReviewStates.PendingWithdraw]: 'clock',
    [RegistrationReviewStates.Embargo]: 'lock',
    [RevisionReviewStates.RevisionPendingModeration]: 'hourglass',
};

interface Args {
    registration: RegistrationModel;
    state: RegistrationReviewStates | RevisionReviewStates.RevisionPendingModeration;
}

export default class RegistrationListCard extends Component<Args> {
    @service toast!: Toast;
    latestRevision?: RevisionModel;

    get revisionIsPending() {
        return this.args.registration.revisionState === RevisionReviewStates.RevisionPendingModeration;
    }

    get icon(): string {
        const { state } = this.args;
        return iconMap[state] || '';
    }

    get queryParams() {
        const defaultQueryParams = {
            mode: 'moderator',
        };
        if (this.args.state === RevisionReviewStates.RevisionPendingModeration &&
            this.revisionIsPending && this.latestRevision) {
            return {
                revisionId: this.latestRevision.id,
                ...defaultQueryParams,
            };
        }
        return defaultQueryParams;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (this.args.state === RevisionReviewStates.RevisionPendingModeration) {
            taskFor(this.getLatestRevision).perform();
        }
    }

    @task
    @waitFor
    async getLatestRevision() {
        try {
            const revisions = await this.args.registration.queryHasMany('revisions');
            this.latestRevision = A(revisions || []).objectAt(0);
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }
}
