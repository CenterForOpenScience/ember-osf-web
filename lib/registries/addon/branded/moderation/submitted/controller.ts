import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';

type SubmittedStates =
    RegistrationReviewStates.Accepted |
    RegistrationReviewStates.Embargo |
    RegistrationReviewStates.Withdrawn |
    RegistrationReviewStates.Rejected;

export default class RegistriesModerationSubmittedController extends Controller {
    queryParams = ['state'];

    @tracked state?: SubmittedStates;

    @action
    changeTab(tab: SubmittedStates) {
        this.state = tab;
    }
}
