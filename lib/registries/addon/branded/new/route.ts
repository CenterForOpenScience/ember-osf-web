import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { taskFor } from 'ember-concurrency-ts';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import requireAuth from 'ember-osf-web/decorators/require-auth';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';
import BrandedRegistriesNewSubmissionController from './controller';

const {
    featureFlagNames: {
        egapAdmins,
    },
} = config;

@requireAuth()
export default class BrandedRegistriesNewSubmissionRoute extends Route {
    @service analytics!: Analytics;
    @service features!: Features;

    model() {
        return this.modelFor('branded');
    }

    afterModel(provider: RegistrationProviderModel) {
        const { href, origin } = window.location;
        const currentUrl = href.replace(origin, '');

        if (!provider.allowSubmissions) {
            this.transitionTo('page-not-found', currentUrl.slice(1));
        }

        // TODO: Remove this when moderation is in place
        if (provider.id === 'egap' && !this.features.isEnabled(egapAdmins)) {
            this.transitionTo('page-not-found', currentUrl.slice(1));
        }
    }

    setupController(
        controller: BrandedRegistriesNewSubmissionController,
        model: RegistrationProviderModel,
        transition: Transition,
    ) {
        super.setupController(controller, model, transition);

        taskFor(controller.projectSearch).perform();
        taskFor(controller.findAllSchemas).perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
