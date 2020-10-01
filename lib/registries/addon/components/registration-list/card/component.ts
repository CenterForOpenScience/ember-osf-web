import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel from 'ember-osf-web/models/registration';
import UserModel from 'ember-osf-web/models/user';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

const iconMap: Record<string, string> = {
    pending: 'hourglass',
    withdrawn: 'ban',
    accepted: 'check-circle-o',
    rejected: 'times',
    pendingWithdraw: 'clock',
};

interface Args {
    registration: RegistrationModel;
    filterState: string;
}

export default class RegistrationListCard extends Component<Args> {
    @tracked registeredBy?: string;

    @task({ withTestWaiter: true })
    fetchRegisteredBy = task(function *(this: RegistrationListCard) {
        const registeredByUser: UserModel = yield this.args.registration.registeredBy;
        this.registeredBy = registeredByUser.fullName;
    });

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.fetchRegisteredBy.perform();
    }

    get showModerator() {
        const { filterState } = this.args;
        if (['accepted', 'rejected'].includes(filterState)) {
            return true;
        }
        return false;
    }

    get icon(): string {
        const { filterState } = this.args;
        return iconMap[filterState] ? iconMap[filterState] : '';
    }

    get timeSubmitted(): string {
        return formattedTimeSince(this.args.registration.dateRegistered);
    }
}
