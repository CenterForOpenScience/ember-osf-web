import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import InternalResourceModel from 'ember-osf-web/models/internal-resource';
import NodeModel from 'ember-osf-web/models/node';
import Provider from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';

interface Args {
    node: NodeModel;
}

export default class AddonsServiceManagerComponent extends Component<Args> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;

    node = this.args.node;
    @tracked addonServiceNode?: InternalResourceModel;

    @tracked addonProviders: Provider[] = [];

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getStorageServiceNode).perform();
        taskFor(this.getAddonProviders).perform();
        taskFor(this.getConfiguredAddonProviders).perform();
    }

    @task
    @waitFor
    async getStorageServiceNode() {
        this.addonServiceNode = await this.store.findRecord('internal-resource', this.node.id);
    }

    @task
    @waitFor
    async getConfiguredAddonProviders() {
        if (this.addonServiceNode) {
            return await this.addonServiceNode.get('configuredStorageAddons');
        }
        return [];
    }

    @task
    @waitFor
    async getAddonProviders() {
        const serviceStorageProviders: Provider[] = await taskFor(this.serviceStorageProviders).perform();

        serviceStorageProviders.sort(this.providerSorter);
        this.addonProviders = serviceStorageProviders;
    }

    providerSorter(a: Provider, b: Provider) {
        return a.provider.name.localeCompare(b.provider.name);
    }

    get projectEnabledAddons(): ConfiguredStorageAddonModel[] {
        return this.serviceProjectEnabledAddons();
    }

    get isLoading() {
        return taskFor(this.getAddonProviders).isRunning;
    }

    // Service API Methods

    @task
    @waitFor
    async serviceStorageProviders() {
        const serviceStorageProviders = (await this.store.findAll('external-storage-service')).toArray();
        const serviceProviders = [] as Provider[];
        for (const provider of serviceStorageProviders) {
            serviceProviders.addObject(new Provider(provider, this.currentUser, this.node));
        }
        return serviceProviders;
    }

    serviceProjectEnabledAddons() {
        return this.addonServiceNode?.get('configuredStorageAddons').toArray() || [];
    }
}
