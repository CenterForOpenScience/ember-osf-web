import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

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

    @tracked addonProviders: Array<LegacyProvider | Provider> = [];

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getAddonProviders).perform();
    }

    @task
    @waitFor
    async getAddonProviders() {
        const legacyProviders: LegacyProvider[] = await taskFor(this.legacyProviders).perform();
        const serviceStorageProviders: Provider[] = this.serviceStorageProviders();

        const providers = [...legacyProviders, ...serviceStorageProviders]
            .sort(this.providerSorter);
        this.addonProviders = providers;
    }

    providerSorter(a: Provider, b: Provider) {
        return a.provider.name.localeCompare(b.provider.name);
    }

    get projectEnabledAddons(): Array<LegacyProvider | Provider> {
        const legacyAddons = this.legacyProjectEnabledAddons();
        const serviceAddons = this.serviceProjectEnabledAddons();
        return [...legacyAddons, ...serviceAddons];
    }

    // V2 API Methods

    @task
    @waitFor
    async legacyProviders() {
        const addons = (await this.store.findAll('addon')).toArray();
        const legacyAddons = [] as LegacyProvider[];
        for (const addon of addons) {
            legacyAddons.addObject(new LegacyProvider(addon, this.currentUser, this.node));
        }
        return legacyAddons;
    }

    get isLoading() {
        return taskFor(this.getAddonProviders).isRunning;
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
        return [];
    }
}
