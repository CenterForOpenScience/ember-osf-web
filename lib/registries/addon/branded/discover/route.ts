import Route from '@ember/routing/route';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export default class BrandedRegistriesDiscoverRoute extends Route {
    // this route uses the registries.discover page template where the custom branding is handled
    templateName = 'discover';

    model() {
        return this.modelFor('branded');
    }

    afterModel(provider: RegistrationProviderModel) {
        if (!provider.brandedDiscoveryPage) {
            if (provider.id === 'osf') {
                this.transitionTo('discover');
            } else {
                this.transitionTo('page-not-found', notFoundURL(window.location.pathname));
            }
        }
    }
}
