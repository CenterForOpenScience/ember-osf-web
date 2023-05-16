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

    setupController(controller: SearchController, _model: any, _transition: any) {
        super.setupController(controller, _model, _transition);
        controller.ingestQueryParams();
    }
}
