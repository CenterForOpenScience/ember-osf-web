import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';

export default class RegistriesModerationSubmissionController extends Controller {
    queryParams = ['state'];

    @tracked state: RegistrationReviewStates = RegistrationReviewStates.Pending;

    @action
    changeTab(tab: RegistrationReviewStates) {
        this.state = tab;
    }
}
