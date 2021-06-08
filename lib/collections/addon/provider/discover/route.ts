import Store from '@ember-data/store';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

export default class ProviderDiscover extends Route {
    controllerName = 'discover';
    templateName = 'discover';

    @service store!: Store;
    @service theme!: Theme;
    @service analytics!: Analytics;

    model() {
        return [];
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
