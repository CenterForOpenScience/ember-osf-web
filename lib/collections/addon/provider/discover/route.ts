import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';

export default class ProviderDiscover extends Route {
    controllerName = 'discover';
    templateName = 'discover';

    @service store!: Store;
    @service theme!: Theme;

    model() {
        return [];
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                searchProviderId: this.theme.id,
            },
        };
    }
}
