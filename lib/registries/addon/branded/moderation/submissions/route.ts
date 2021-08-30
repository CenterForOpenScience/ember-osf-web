import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';

import RegistriesModerationSubmissionController from './controller';

export default class BrandedModerationSubmissionsRoute extends Route {
    @service analytics!: Analytics;

    setupController(
        controller: RegistriesModerationSubmissionController,
        model: RegistrationProviderModel,
        transition: Transition,
    ) {
        super.setupController(controller, model, transition);
        const { state } = controller;
        if (!state
            || ![
                RegistrationReviewStates.Pending,
                RegistrationReviewStates.Accepted,
                RegistrationReviewStates.Embargo,
                RegistrationReviewStates.Rejected,
                RegistrationReviewStates.Withdrawn,
                RegistrationReviewStates.PendingWithdraw,
            ].includes(state!)) {
            controller.set('state', 'pending');
            this.replaceWith('branded.moderation.submissions');
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
