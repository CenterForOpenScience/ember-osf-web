import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

export default class Preprints extends Controller {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    @service analytics!: Analytics;

    livedata = 'livedata';
    providerAsset = 'https://localhost:4200';
    routePrefix = 'https://localhost:4200';

    @action
    onSearch(query: string) {
        let route = 'search';

        if (this.theme.isSubRoute) {
            route = 'provider.discover';
        }

        this.router.transitionTo(route, { queryParams: { q: query } });
    }
}
