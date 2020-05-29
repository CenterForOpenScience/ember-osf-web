import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

import RegistriesDiscoverController from './controller';

export default class RegistriesDiscoverRoute extends Route {
    @service analytics!: Analytics;

    setupController(controller: RegistriesDiscoverController, model: {}) {
        super.setupController(controller, model);
        controller.getCountsAndAggs.perform();
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
