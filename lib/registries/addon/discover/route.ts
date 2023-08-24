import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class RegistriesDiscoverRoute extends Route {
    @service router!: RouterService;
    afterModel() {
        this.router.transitionTo('search', { queryParams: { resourceType: 'Registration,RegistrationComponent' }});
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
                providerId: 'osf',
            },
        };
    }
}
