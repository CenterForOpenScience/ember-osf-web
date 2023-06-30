import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Theme from 'ember-osf-web/services/theme';

export default class PreprintDiscoverRoute extends Route {
    @service store!: Store;
    @service theme!: Theme;

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
                providerId: this.theme.id,
            },
        };
    }

    async model(args: any) {
        // Error handling?
        this.theme.providerType = 'preprint';
        this.theme.id = args.provider_id;
        return await this.store.findRecord('preprint-provider', args.provider_id);
    }
}
