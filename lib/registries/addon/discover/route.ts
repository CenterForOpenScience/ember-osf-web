import Route from '@ember/routing/route';

export default class RegistriesDiscoverRoute extends Route {
    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
                providerId: 'osf',
            },
        };
    }
}