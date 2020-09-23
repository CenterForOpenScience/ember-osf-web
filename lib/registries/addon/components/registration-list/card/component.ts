import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import RegistrationModel from 'ember-osf-web/models/registration';
import UserModel from 'ember-osf-web/models/user';

const iconMap: Record<string, string> = {
    pending: 'hourglass',
    withdrawn: 'ban',
    accepted: 'check-circle-o',
    rejected: 'times',
};

interface Args {
    registation: RegistrationModel;
    filterState: string;
}

export default class RegistrationListCard extends Component<Args> {
    @tracked registeredBy?: string;

    @task({ withTestWaiter: true, on: 'init' })
    fetchRegisteredBy = task(function *(this: RegistrationListCard) {
        const registeredByUser: UserModel = yield this.args.registation.registeredBy;
        this.registeredBy = registeredByUser.fullName;
    });

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
}
