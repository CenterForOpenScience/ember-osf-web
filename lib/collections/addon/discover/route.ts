import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
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
        return this.store
            .findAll('preprint-provider', { reload: true });
    }

    @action
    willTransition() {
        const controller = this.controllerFor('collections/discover');
        controller._clearFilters();
        controller._clearQueryString();
    }
}
