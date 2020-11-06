import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';

const iconMap: Partial<Record<RegistrationReviewStates, string>> = {
    // This is a subset of RegistrationReviewStates that only applies to moderation
    [RegistrationReviewStates.Pending]: 'hourglass',
    [RegistrationReviewStates.Withdrawn]: 'ban',
    [RegistrationReviewStates.Accepted]: 'check',
    [RegistrationReviewStates.Rejected]: 'times',
    [RegistrationReviewStates.PendingWithdraw]: 'clock-o',
    [RegistrationReviewStates.Embargo]: 'lock',
};

interface Args {
    registration: RegistrationModel;
    filterState: RegistrationReviewStates;
}

export default class RegistrationListCard extends Component<Args> {
    @tracked reviewActions?: ReviewActionModel[];

    get icon(): string {
        const { filterState } = this.args;
        return iconMap[filterState] || '';
    }

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: RegistrationListCard) {
        const reviewActions = yield this.args.registration.reviewActions;
        this.reviewActions = reviewActions.toArray();
    });

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.fetchActions.perform();
    }
}
