import Route from '@ember/routing/route';

export default class Search extends Route {
    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
            },
        };
    }
}
