import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';

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
    @service intl!: IntlService;

    node = this.args.node;
    @tracked addonServiceNode?: InternalResourceModel;

    @tracked addonProviders: Provider[] = [];

    @tracked showTerms = false;
    @tracked showAccountSetup = false;
    @tracked showConfirm = false;
    @tracked showConfigure = false;
    @tracked selectedProvider?: Provider;

    @action
    configureProvider(provider: Provider) {
        this.cancelSetup();
        this.selectedProvider = provider;
        this.showConfigure = true;
    }

    @action
    beginAccountSetup(provider: Provider) {
        this.cancelSetup();
        this.showTerms = true;
        this.selectedProvider = provider;
    }

    @action
    acceptTerms() {
        this.showAccountSetup = true;
        this.showTerms = false;
        this.showConfirm = false;
        this.showConfigure = false;
    }

    @action
    authorizeSelectedAccount() {
        this.showConfirm = true;
        this.showTerms = false;
        this.showAccountSetup = false;
        this.showConfigure = false;
    }

    @action
    confirmAccountSetup() {
        this.showConfigure = true;
        this.showTerms = false;
        this.showAccountSetup = false;
        this.showConfirm = false;
    }

    @action
    cancelSetup() {
        this.showTerms = false;
        this.showAccountSetup = false;
        this.showConfirm = false;
        this.showConfigure = false;
        this.selectedProvider = undefined;
    }

    @action
    save() {
        this.cancelSetup();
        // TODO: Actually save the provider
    }

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

    get headingText() {
        const providerName = this.selectedProvider?.provider.name;
        let heading = this.intl.t('addons.heading');
        if (this.showTerms) {
            heading = this.intl.t('addons.terms.heading', { providerName });
        }
        if (this.showAccountSetup) {
            heading = this.intl.t('addons.accountSelect.heading', { providerName });
        }
        if (this.showConfirm) {
            heading = this.intl.t('addons.confirm.heading', { providerName });
        }
        if (this.showConfigure) {
            heading = this.intl.t('addons.configure.heading', { providerName });
        }
        return heading;
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
