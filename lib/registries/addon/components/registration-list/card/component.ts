import Component from '@glimmer/component';

import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';

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
    get icon(): string {
        const { filterState } = this.args;
        return iconMap[filterState] || '';
    }
}
