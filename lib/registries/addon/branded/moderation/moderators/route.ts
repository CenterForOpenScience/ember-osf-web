import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';
import BrandedModerationModeratorsController from './controller';

export default class BrandedModerationModeratorsRoute extends Route {
    @service analytics!: Analytics;

    model() {
        return this.modelFor('branded');
    }

    setupController(controller: BrandedModerationModeratorsController, model: RegistrationProviderModel) {
        super.setupController(controller, model);
        controller.loadModerators.perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
