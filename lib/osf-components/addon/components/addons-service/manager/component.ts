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

enum PageMode {
    TERMS = 'terms',
    ACCOUNT_SELECT = 'accountSelect',
    CONFIRM = 'confirm',
    CONFIGURE = 'configure',
}

enum FilterTypes {
    STORAGE = 'additional-storage',
    CITATION_MANAGER = 'citation-manager',
    CLOUD_COMPUTING = 'cloud-computing',
}

interface Args {
    node: NodeModel;
}

export default class AddonsServiceManagerComponent extends Component<Args> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: IntlService;

    node = this.args.node;
    @tracked addonServiceNode?: InternalResourceModel;

    possibleFilterTypes = Object.values(FilterTypes);
    @tracked filterText = '';
    @tracked activeFilterType: FilterTypes = FilterTypes.STORAGE;
    @tracked storageProviders: Provider[] = [];
    @tracked allAddonProviders: Provider[] = [];

    @tracked pageMode?: PageMode;
    @tracked selectedProvider?: Provider;

    @action
    filterByAddonType(type: FilterTypes) {
        this.activeFilterType = type;
    }

    get filteredAddonProviders() {
        let possibleProviders: any[] = [];
        switch (this.activeFilterType) {
        case FilterTypes.STORAGE:
            possibleProviders = this.storageProviders;
            break;
        case FilterTypes.CITATION_MANAGER:
        case FilterTypes.CLOUD_COMPUTING:
            possibleProviders = [];
            break;
        }
        const textFilteredAddons = possibleProviders.filter(
            (provider: any) => provider.provider.name.toLowerCase().includes(this.filterText.toLowerCase()),
        );

        return textFilteredAddons;
    }

    @action
    configureProvider(provider: Provider) {
        this.cancelSetup();
        this.selectedProvider = provider;
        this.pageMode = PageMode.CONFIGURE;
    }

    @action
    beginAccountSetup(provider: Provider) {
        this.cancelSetup();
        this.pageMode = PageMode.TERMS;
        this.selectedProvider = provider;
    }

    @action
    acceptTerms() {
        this.pageMode = PageMode.ACCOUNT_SELECT;
    }

    @action
    authorizeSelectedAccount() {
        this.pageMode = PageMode.CONFIRM;
    }

    @action
    confirmAccountSetup() {
        this.pageMode = PageMode.CONFIGURE;
    }

    @action
    cancelSetup() {
        this.pageMode = undefined;
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
        this.storageProviders = serviceStorageProviders;
        // Get other provider types here, eventually
        const allProviders = [...serviceStorageProviders];
        allProviders.sort(this.providerSorter);
        this.allAddonProviders = allProviders;
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
        let heading;
        switch (this.pageMode) {
        case PageMode.TERMS:
            heading = this.intl.t('addons.terms.heading', { providerName });
            break;
        case PageMode.ACCOUNT_SELECT:
            heading = this.intl.t('addons.accountSelect.heading', { providerName });
            break;
        case PageMode.CONFIRM:
            heading = this.intl.t('addons.confirm.heading', { providerName });
            break;
        case PageMode.CONFIGURE:
            heading = this.intl.t('addons.configure.heading', { providerName });
            break;
        default:
            heading = this.intl.t('addons.heading');
            break;
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
