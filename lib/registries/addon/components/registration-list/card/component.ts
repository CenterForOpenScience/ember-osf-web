import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel from 'ember-osf-web/models/registration';
import RegistrationActionModel from 'ember-osf-web/models/registration-action';

import UserModel from 'ember-osf-web/models/user';
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
    @tracked registeredBy?: string;
    @tracked showFullActionList: boolean = false;
    @tracked reviewActions?: RegistrationActionModel[];

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
    fetchRegisteredBy = task(function *(this: RegistrationListCard) {
        const registeredByUser: UserModel = yield this.args.registration.registeredBy;
        this.registeredBy = registeredByUser.fullName;
    });

    @task({ withTestWaiter: true })
    fetchActions = task(function *(this: RegistrationListCard) {
        const actionsProxy = yield this.args.registration.reviewActions;
        this.reviewActions = actionsProxy.content();
    });

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.fetchRegisteredBy.perform();
    }

    @action
    toggleActionList() {
        if (!this.fetchActions.value) {
            this.fetchActions.perform();
        }
        this.showFullActionList = !this.showFullActionList;
    }
}
