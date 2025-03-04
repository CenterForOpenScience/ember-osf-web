import Store from '@ember-data/store';
import Route from '@ember/routing/route'; import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class RecentActivityRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        return {
            registration: this.modelFor('overview'),
        };
    }
}
