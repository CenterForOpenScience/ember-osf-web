import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

import NodeModel from 'ember-osf-web/models/node';
import LegacyProvider from 'ember-osf-web/packages/addons-service/legacy-provider';
import Provider from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';

interface Args {
    node: NodeModel;
}

export default class AddonsServiceManagerComponent extends Component<Args> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;

    node = this.args.node;

    @task
    @waitFor
    async addonProviders(): Promise<(Array<LegacyProvider | Provider>)> {
        const legacyProviders: LegacyProvider[] = await this.legacyProviders();
        const serviceStorageProviders: Provider[] = this.serviceStorageProviders();

        return [...legacyProviders, ...serviceStorageProviders]
            .sort(this.providerSorter);
    }

    providerSorter(a: Provider, b: Provider) {
        return a.provider.name.localeCompare(b.provider.name);
    }

    // V2 API Methods

    @task
    @waitFor
    async legacyProviders() {
        const addons = await this.store.findAll('addon');
        const legacyAddons = [] as LegacyProvider[];
        for (const addon of addons) {
            legacyAddons.addObject(new LegacyProvider(addon, this.currentUser, this.node));
        }
        return addons;
    }

    legacyProjectEnabledAddons() {
        // TODO: This will probably have to be abstracted out in the same way Providers are
        return this.node.nodeAddons.toArray();
    }

    // Service API Methods

    serviceStorageProviders() {
        return [];
    }

    serviceProjectEnabledAddons() {
        return;
    }
}
