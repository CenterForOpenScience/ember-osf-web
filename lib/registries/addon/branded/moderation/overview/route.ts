import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';
import BrandedModerationOverviewController from '../overview/controller';

export interface BrandedModeratedOverviewModel {
    provider: RegistrationProviderModel;
    registrationId: string;
}

export default class BrandedModeratedOverviewRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    model(params: { providerId: string, guid: string }) {
        return {
            provider: this.modelFor('branded'),
            registrationId: params.guid,
        };
    }

    setupController(controller: BrandedModerationOverviewController, model: BrandedModeratedOverviewModel) {
        super.setupController(controller, model);
        controller.loadRegistration.perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
