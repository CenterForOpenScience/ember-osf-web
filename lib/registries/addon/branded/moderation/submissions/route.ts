import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';

import RegistriesModerationSubmissionController from './controller';

export default class BrandedModerationSubmissionsRoute extends Route {
    @service analytics!: Analytics;

    setupController(controller: RegistriesModerationSubmissionController, model: RegistrationProviderModel) {
        super.setupController(controller, model);
        const { state } = controller;
        if (state && !(Object.values(RegistrationReviewStates).includes(state))) {
            this.replaceWith('branded.moderation.submissions');
            controller.set('state', 'pending');
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
