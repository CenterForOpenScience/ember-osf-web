import EmberArray, { A } from '@ember/array';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Task, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import NodeModel from 'ember-osf-web/models/node';
import Provider from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';

interface FilterSpecificObject {
    modelName: string;
    task: Task<any, any>;
    list: EmberArray<Provider>;
}

enum PageMode {
    TERMS = 'terms',
    NEW_OR_EXISTING_ACCOUNT = 'newOrExistingAccount',
    ACCOUNT_SELECT = 'accountSelect',
    ACCOUNT_CREATE = 'accountCreate',
    CONFIRM = 'confirm',
    CONFIGURE = 'configure',
}

export enum FilterTypes {
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
    @tracked addonServiceNode?: ResourceReferenceModel;

    possibleFilterTypes = Object.values(FilterTypes);
    filterTypeMapper: Record<FilterTypes, FilterSpecificObject> = {
        [FilterTypes.STORAGE]: {
            modelName: 'external-storage-service',
            task: taskFor(this.getStorageAddonProviders),
            list: A([]),
        },
        [FilterTypes.CITATION_MANAGER]: {
            modelName: 'citation-service',
            task: taskFor(this.getCitationAddonProviders),
            list: A([]),
        },
        [FilterTypes.CLOUD_COMPUTING]: {
            modelName: 'cloud-computing-service',
            task: taskFor(this.getCloudComputingProviders),
            list: A([]),
        },
    };
    @tracked filterText = '';
    @tracked activeFilterType: FilterTypes = FilterTypes.STORAGE;

    @tracked pageMode?: PageMode;
    @tracked selectedProvider?: Provider;
    @tracked selectedAccount?: AuthorizedStorageAccountModel;
    @tracked username?: string;
    @tracked password?: string;

    @action
    filterByAddonType(type: FilterTypes) {
        this.activeFilterType = type;
        const activeFilterObject = this.filterTypeMapper[type];
        if (activeFilterObject.list.length === 0) {
            activeFilterObject.task.perform();
        }
    }

    get filteredAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        const possibleProviders = activeFilterObject.list;
        const textFilteredAddons = possibleProviders.filter(
            (provider: any) => provider.provider.name.toLowerCase().includes(this.filterText.toLowerCase()),
        );

        return textFilteredAddons;
    }

    get currentListIsLoading() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        return activeFilterObject.task.isRunning;
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
    async acceptTerms() {
        await taskFor(this.selectedProvider!.getAuthorizedStorageAccounts).perform();
        if(this.selectedProvider!.authorizedStorageAccounts!.length > 0){
            this.pageMode = PageMode.NEW_OR_EXISTING_ACCOUNT;
        } else {
            this.pageMode = PageMode.ACCOUNT_CREATE;
        }
    }

    @action
    chooseExistingAccount() {
        this.pageMode = PageMode.ACCOUNT_SELECT;
    }

    @action
    createNewAccount() {
        this.pageMode = PageMode.ACCOUNT_CREATE;
    }

    @action
    authorizeSelectedAccount() {
        this.pageMode = PageMode.CONFIRM;
    }

    @task
    @waitFor
    async connectAccount() {
        if (this.selectedProvider) {
            const newAccount = await taskFor(this.selectedProvider.createAccountForNodeAddon).perform();
            await taskFor(this.selectedProvider.createConfiguredStorageAddon).perform(newAccount);
        }
        this.pageMode = PageMode.CONFIGURE;
    }

    @task
    @waitFor
    async confirmAccountSetup(account: AuthorizedStorageAccountModel) {
        if (this.selectedProvider && this.selectedAccount) {
            await taskFor(this.selectedProvider.createConfiguredStorageAddon).perform(account);
        }
        this.pageMode = PageMode.CONFIGURE;
    }

    @action
    cancelSetup() {
        this.pageMode = undefined;
        this.selectedProvider = undefined;
        this.selectedAccount = undefined;
    }

    @action
    save() {
        this.cancelSetup();
        // TODO: Actually save the provider
    }

    @action
    selectAccount(account: AuthorizedStorageAccountModel) {
        this.selectedAccount = account;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getStorageServiceNode).perform();
        taskFor(this.getStorageAddonProviders).perform();
        taskFor(this.getConfiguredAddonProviders).perform();
    }

    @task
    @waitFor
    async getStorageServiceNode() {
        this.addonServiceNode = await this.store.findRecord('resource-reference', this.node.id);
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
    async getStorageAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.STORAGE];
        const serviceStorageProviders: Provider[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = serviceStorageProviders.sort(this.providerSorter);
    }

    @task
    @waitFor
    async getCloudComputingProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];
        const cloudComputingProviders: Provider[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = cloudComputingProviders.sort(this.providerSorter);
    }

    @task
    @waitFor
    async getCitationAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];
        const serviceCloudComputingProviders: Provider[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = serviceCloudComputingProviders.sort(this.providerSorter);
    }

    providerSorter(a: Provider, b: Provider) {
        return a.provider.name.localeCompare(b.provider.name);
    }

    get projectEnabledAddons(): ConfiguredStorageAddonModel[] {
        return this.serviceProjectEnabledAddons();
    }

    get headingText() {
        const providerName = this.selectedProvider?.provider.name;
        let heading;
        switch (this.pageMode) {
        case PageMode.TERMS:
            heading = this.intl.t('addons.terms.heading', { providerName });
            break;
        case PageMode.NEW_OR_EXISTING_ACCOUNT:
            heading = this.intl.t('addons.accountSelect.heading', { providerName });
            break;
        case PageMode.ACCOUNT_CREATE:
            heading = this.intl.t('addons.accountSelect.new-account');
            break;
        case PageMode.ACCOUNT_SELECT:
            heading = this.intl.t('addons.accountSelect.existing-account');
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
    async getExternalProviders(providerType: string) {
        const serviceProviderModels = (await this.store.findAll(providerType)).toArray();
        const serviceProviders = [] as Provider[];
        for (const provider of serviceProviderModels) {
            serviceProviders.addObject(new Provider(provider, this.currentUser, this.node));
        }
        return serviceProviders;
    }

    serviceProjectEnabledAddons() {
        return this.addonServiceNode?.get('configuredStorageAddons').toArray() || [];
    }
}
