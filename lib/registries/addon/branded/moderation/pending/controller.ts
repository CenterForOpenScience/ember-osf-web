import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

type PendingStates =
    RegistrationReviewStates.Pending |
    RegistrationReviewStates.PendingWithdrawRequest |
    RevisionReviewStates.RevisionPendingModeration;
export default class RegistriesModerationPendingController extends Controller {
    queryParams = ['state'];

    @tracked state?: PendingStates;

    @action
    changeTab(tab: PendingStates) {
        this.state = tab;
    }
}
