import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service, Registry as Services } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Store from 'ember-data/store';
import config from 'ember-get-config';
import RSVP from 'rsvp';

import Analytics from 'ember-osf-web/services/analytics';
import { SearchOptions, SearchOrder, SearchResults } from 'ember-osf-web/services/search';
import ShareSearch, { ShareRegistration } from 'ember-osf-web/services/share-search';

export default class Index extends Controller {
    @service store!: Store;
    @service router!: Services['router'];
    @service analytics!: Analytics;
    @service shareSearch!: ShareSearch;

    recentRegistrations: EmberArray<ShareRegistration> = A([]);
    searchableRegistrations = 0;

    @task({ on: 'init' })
    getRecentRegistrations = task(function *(this: Index) {
        const [recentResults, totalResults]: Array<SearchResults<ShareRegistration>> = yield RSVP.all([
            this.shareSearch.registrations(new SearchOptions({
                order: new SearchOrder({ display: '', ascending: false, key: 'date_updated' }),
                query: config.OSF.registries.indexPageRegistrationsQuery,
                size: 5,
            })),
            this.shareSearch.registrations(new SearchOptions({
                size: 0,
            })),
            this.store.findAll('registration-schema'),
        ]);
        this.set('recentRegistrations', recentResults.results);
        this.set('searchableRegistrations', totalResults.total);
    });

    @action
    onSearch(query: string) {
        this.router.transitionTo('registries.discover', {
            queryParams: { q: query },
        });
    }
}
