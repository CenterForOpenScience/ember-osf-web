import Component from '@glimmer/component';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';

const iconMap: Partial<Record<RegistrationReviewStates, string>> = {
    [RegistrationReviewStates.Pending]: 'hourglass',
    [RegistrationReviewStates.Withdrawn]: 'ban',
    [RegistrationReviewStates.Accepted]: 'check',
    [RegistrationReviewStates.Rejected]: 'times',
    [RegistrationReviewStates.PendingWithdraw]: 'clock',
    [RegistrationReviewStates.Embargo]: 'lock',
};

interface Args {
    registration: RegistrationModel;
    state: RegistrationReviewStates;
}

export default class RegistrationListCard extends Component<Args> {
    get icon(): string {
        const { state } = this.args;
        return iconMap[state] || '';
    }
}
