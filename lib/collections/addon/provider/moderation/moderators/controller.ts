import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';

export default class CollectionsModerationModeratorsController extends Controller {
    @service router!: RouterService;
    @service store!: Store;

    @task
    @waitFor
    async refetchProvider(id: string) {
        await this.store.findRecord('collection-provider', id, { reload: true });
        this.router.transitionTo('collections.provider.discover', id);
    }
}
