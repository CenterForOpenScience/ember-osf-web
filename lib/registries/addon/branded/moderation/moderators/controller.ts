import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
export default class BrandedModerationModeratorsController extends Controller {
    @service router!: RouterService;
    @service store!: Store;

    @action
    afterSelfRemoval() {
        taskFor(this.refetchProvider).perform(this.model.id);
    }

    @task
    @waitFor
    async refetchProvider(id: string) {
        await this.store.findRecord('registration-provider', id, { reload: true });
        this.router.transitionTo('registries.branded.discover', id);
    }
}
