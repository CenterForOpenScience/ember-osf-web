import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Discover extends Route {
    @service store!: Store;

    queryParams = {
        queryString: {
            replace: true,
        },
    };

    model() {
        return this.store.findAll('collection-provider', { reload: true });
    }
}
