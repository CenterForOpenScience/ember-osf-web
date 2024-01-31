import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { waitFor } from '@ember/test-waiters';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import CurrentUserService from 'ember-osf-web/services/current-user';
import Provider from 'ember-osf-web/packages/addons-service/provider';

export interface AddonModelShape {
    task: (addonId: string) => Promise<Provider>;
    taskInstance: Promise<Provider>;
}

export default class GuidNodeAddonsAddon extends Route {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service router!: RouterService;

    @task
    @waitFor
    async getAddonProvider(addonId: string) {
        let node;
        let externalService;
        try {
            node = await this.modelFor('guid-node').taskInstance;
            externalService = await this.store.findRecord('external-storage-service', addonId);
            const provider = new Provider(externalService, this.currentUser, node);
            return provider;
        } catch (e) {
            if (!externalService) {
                this.transitionTo('guid-node.addons');
            } else {
                this.transitionTo('not-found', this.router.currentURL.slice(1));
            }
            throw e;
        }
    }

    model(params: { addonId: string }): AddonModelShape {
        return {
            task: this.getAddonProvider,
            taskInstance: taskFor(this.getAddonProvider).perform(params.addonId),
        };
    }
}
