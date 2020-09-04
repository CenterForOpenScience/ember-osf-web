import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

export default class BrandedModerationModeratorsRoute extends Route {
    @service analytics!: Analytics;

    model() {
        return this.modelFor('branded');
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
