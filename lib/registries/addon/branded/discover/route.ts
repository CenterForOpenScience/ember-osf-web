import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

export default class BrandedRegistriesDiscoverRoute extends Route {
    // this route uses the registries.discover page template where the custom branding is handled
    templateName = 'discover';

    @service analytics!: Analytics;

    model() {
        return this.modelFor('branded');
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
