import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';

const iconMap: Record<string, string> = {
    // This is a subset of RegistrationReviewStates that only applies to moderation
    pending: 'hourglass',
    withdrawn: 'ban',
    accepted: 'check',
    rejected: 'times',
    pending_withdraw: 'clock-o',
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
