import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service, Registry as Services } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Store from '@ember-data/store';

import Analytics from 'ember-osf-web/services/analytics';
import config from 'registries/config/environment';
import ShareSearch, { ShareRegistration } from 'registries/services/share-search';

export default class Index extends Controller {
    @service store!: Store;
    @service router!: Services['router'];
    @service analytics!: Analytics;
    @service shareSearch!: ShareSearch;

    recentRegistrations: EmberArray<ShareRegistration> = A([]);
    searchableRegistrations = 0;

    @task({ on: 'init' })
    @waitFor
    async getRecentRegistrations() {
        const recentRegistrations = await this.store.query('registration', {
            filter: {
                id: config.indexPageRegistrationIds.join(','),
            },
            sort: '-date_modified',
            embed: 'bibliographic_contributors',
        });
        this.setProperties({ recentRegistrations });
    }

    @action
    onSearch(query: string) {
        this.router.transitionTo('search', {
            queryParams: {
                q: query,
                resourceType: 'Registration,RegistrationComponent',
            },
        });
    }
}
