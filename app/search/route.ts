import Route from '@ember/routing/route';

import SearchController from './controller';

export default class Search extends Route {
    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
            },
        };
    }
}
