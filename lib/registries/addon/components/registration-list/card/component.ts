import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel from 'ember-osf-web/models/registration';
import ReviewActionModel from 'ember-osf-web/models/review-action';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

const iconMap: Record<string, string> = {
    pending: 'hourglass',
    withdrawn: 'ban',
    accepted: 'check',
    rejected: 'times',
    pendingWithdraw: 'clock',
};

interface Args {
    registration: RegistrationModel;
    filterState: string;
}

export default class RegistrationListCard extends Component<Args> {
    @tracked showFullActionList: boolean = false;
    @tracked reviewActions?: ReviewActionModel[];
    @tracked latestAction?: ReviewActionModel;

    get actionsListIcon() {
        return this.showFullActionList ? 'caret-down' : 'caret-right';
    }

    get icon(): string {
        const { filterState } = this.args;
        return iconMap[filterState] ? iconMap[filterState] : '';
    }

    get timeSubmitted(): string {
        return formattedTimeSince(this.args.registration.dateRegistered);
    }

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: RegistrationListCard) {
        this.reviewActions = yield this.args.registration.reviewActions;
        if (this.reviewActions) {
            [this.latestAction] = this.reviewActions;
        }
    });

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.fetchActions.perform();
    }

    @action
    toggleActionList() {
        this.showFullActionList = !this.showFullActionList;
    }
}
