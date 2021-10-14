import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import Analytics from 'ember-osf-web/services/analytics';

import RegistriesModerationPendingController from './controller';

export default class BrandedModerationPendingRoute extends Route {
    @service analytics!: Analytics;

    setupController(
        controller: RegistriesModerationPendingController,
        model: RegistrationProviderModel,
        transition: Transition,
    ) {
        super.setupController(controller, model, transition);
        const { state } = controller;
        if (!state
            || ![
                RegistrationReviewStates.Pending,
                RegistrationReviewStates.PendingWithdraw,
                RevisionReviewStates.RevisionPendingModeration,
            ].includes(state!)) {
            controller.set('state', 'pending');
            this.replaceWith('branded.moderation.pending');
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
