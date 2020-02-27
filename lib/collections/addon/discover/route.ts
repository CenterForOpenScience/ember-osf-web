import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default class Discover extends Route {
    @service store!: DS.Store;

    queryParams = {
        queryString: {
            replace: true,
        },
    };

    /**
     * Stub
     */
    model() {
        return this.store.findAll('collection-provider', { reload: true });
    }
}
