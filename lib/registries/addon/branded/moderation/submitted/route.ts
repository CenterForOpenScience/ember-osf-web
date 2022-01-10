import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';

import RegistriesModerationSubmittedController from './controller';

export default class BrandedModerationSubmittedRoute extends Route {
    @service analytics!: Analytics;

    setupController(
        controller: RegistriesModerationSubmittedController,
        model: RegistrationProviderModel,
        transition: Transition,
    ) {
        super.setupController(controller, model, transition);
        const { state } = controller;
        if (!state
            || ![
                RegistrationReviewStates.Accepted,
                RegistrationReviewStates.Embargo,
                RegistrationReviewStates.Rejected,
                RegistrationReviewStates.Withdrawn,
            ].includes(state!)) {
            controller.set('state', RegistrationReviewStates.Accepted);
            this.replaceWith('branded.moderation.submitted');
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
