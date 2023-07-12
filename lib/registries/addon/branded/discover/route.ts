import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export default class BrandedRegistriesDiscoverRoute extends Route {
    @service router!: RouterService;

    model() {
        return this.modelFor('branded');
    }

    afterModel(provider: RegistrationProviderModel) {
        if (!provider.brandedDiscoveryPage) {
            if (provider.id === 'osf') {
                this.router.transitionTo('search', {
                    queryParams: {
                        resourceType: 'osf:Registration',
                    },
                });
            } else {
                this.transitionTo('page-not-found', notFoundURL(window.location.pathname));
            }
        }
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
            },
        };
    }
}
