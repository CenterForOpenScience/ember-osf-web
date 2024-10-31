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
import Toast from 'ember-toastr/services/toast';
import { TrackedObject } from 'tracked-built-ins';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import NodeModel from 'ember-osf-web/models/node';
import Provider, {
    AllAuthorizedAccountTypes, AllConfiguredAddonTypes,
} from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { ConfiguredAddonEditableAttrs } from 'ember-osf-web/models/configured-addon';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import { AccountCreationArgs} from 'ember-osf-web/models/authorized-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';

interface FilterSpecificObject {
    modelName: string;
    task: Task<any, any>;
    list: EmberArray<Provider>;
    configuredAddons?: EmberArray<AllConfiguredAddonTypes>;
}

enum PageMode {
    TERMS = 'terms',
    NEW_OR_EXISTING_ACCOUNT = 'newOrExistingAccount',
    ACCOUNT_SELECT = 'accountSelect',
    ACCOUNT_CREATE = 'accountCreate',
    CONFIRM = 'confirm',
    CONFIGURE = 'configure',
    CONFIGURATION_LIST = 'configurationList'
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
    @service toast!: Toast;

    node = this.args.node;
    @tracked addonServiceNode?: ResourceReferenceModel;

    possibleFilterTypes = Object.values(FilterTypes);
    mapper: Record<FilterTypes, FilterSpecificObject> = {
        [FilterTypes.STORAGE]: {
            modelName: 'external-storage-service',
            task: taskFor(this.getStorageAddonProviders),
            list: A([]),
            configuredAddons: A([]),
        },
        [FilterTypes.CITATION_MANAGER]: {
            modelName: 'external-citation-service',
            task: taskFor(this.getCitationAddonProviders),
            list: A([]),
            configuredAddons: A([]),
        },
        [FilterTypes.CLOUD_COMPUTING]: {
            modelName: 'external-computing-service',
            task: taskFor(this.getCloudComputingProviders),
            list: A([]),
            configuredAddons: A([]),
        },
    };
    filterTypeMapper = new TrackedObject(this.mapper);
    @tracked filterText = '';
    @tracked activeFilterType: FilterTypes = FilterTypes.STORAGE;

    @tracked confirmRemoveConnectedLocation = false;
    @tracked pageMode?: PageMode;
    @tracked selectedProvider?: Provider;
    @tracked selectedConfiguration?: AllConfiguredAddonTypes;
    @tracked selectedAccount?: AllAuthorizedAccountTypes;

    @action
    filterByAddonType(type: FilterTypes) {
        if (this.activeFilterType !== type) {
            this.filterText = '';
        }
        this.activeFilterType = type;
        const activeFilterObject = this.filterTypeMapper[type];
        if (activeFilterObject.list.length === 0) {
            activeFilterObject.task.perform();
        }
    }
    get filteredConfiguredProviders() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        const possibleProviders = activeFilterObject.list;
        const textFilteredAddons = possibleProviders.filter(
            (provider: any) => provider.provider.displayName.toLowerCase().includes(this.filterText.toLowerCase()),
        );

        const configuredProviders = textFilteredAddons.filter((provider: Provider) => provider.isConfigured);

        return configuredProviders;
    }

    get filteredAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        const possibleProviders = activeFilterObject.list;
        const textFilteredAddons = possibleProviders.filter(
            (provider: any) => provider.provider.displayName.toLowerCase().includes(this.filterText.toLowerCase()),
        );

        return textFilteredAddons;
    }

    get currentListIsLoading() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        return activeFilterObject.task.isRunning || taskFor(this.initialize).isRunning;
    }

    @action
    async configureProvider(provider: Provider, configuredAddon: AllConfiguredAddonTypes) {
        this.cancelSetup();
        this.selectedProvider = provider;
        this.selectedConfiguration = configuredAddon;
        this.pageMode = PageMode.CONFIGURE;
    }

    @action
    listProviderConfigurations(provider: Provider) {
        this.cancelSetup();
        this.selectedProvider = provider;
        this.pageMode = PageMode.CONFIGURATION_LIST;
    }

    @action
    beginAccountSetup(provider: Provider) {
        this.cancelSetup();
        this.pageMode = PageMode.TERMS;
        this.selectedProvider = provider;
    }

    @action
    async acceptTerms() {
        await taskFor(this.selectedProvider!.getAuthorizedAccounts).perform();
        if(this.selectedProvider!.authorizedAccounts!.length > 0){
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
    async createAuthorizedAccount(arg: AccountCreationArgs) {
        if (this.selectedProvider) {
            const newAccount = await taskFor(this.selectedProvider.createAuthorizedAccount)
                .perform(arg);
            return newAccount;
        }
        return undefined;
    }

    @task
    @waitFor
    async createConfiguredAddon(newAccount: AllAuthorizedAccountTypes) {
        if (this.selectedProvider) {
            this.selectedConfiguration = await taskFor(this.selectedProvider.createConfiguredAddon).perform(newAccount);
        }
    }

    @task
    @waitFor
    async connectAccount(arg: AccountCreationArgs) {
        if (this.selectedProvider) {
            const newAccount = await taskFor(this.createAuthorizedAccount).perform(arg);
            if (newAccount) {
                await taskFor(this.createConfiguredAddon).perform(newAccount);
                this.pageMode = PageMode.CONFIGURE;
            }
        }
    }

    @task
    @waitFor
    async oauthFlowRefocus(newAccount: AllAuthorizedAccountTypes): Promise<boolean> {
        await newAccount.reload();
        if (newAccount.credentialsAvailable) {
            await taskFor(this.selectedProvider!.getAuthorizedAccounts).perform();
            this.selectedAccount = undefined;
            this.chooseExistingAccount();
            return true;
        }
        return false;
    }

    @task
    @waitFor
    async confirmAccountSetup(account: AllAuthorizedAccountTypes) {
        if (this.selectedProvider && this.selectedAccount) {
            this.selectedConfiguration = await taskFor(this.selectedProvider.createConfiguredAddon).perform(account);
        }
        this.pageMode = PageMode.CONFIGURE;
    }

    @action
    cancelSetup() {
        this.pageMode = undefined;
        this.selectedProvider = undefined;
        this.selectedConfiguration = undefined;
        this.selectedAccount = undefined;
        this.confirmRemoveConnectedLocation = false;
    }

    @task
    @waitFor
    async saveConfiguration(args: ConfiguredAddonEditableAttrs) {
        try {
            if (this.selectedConfiguration && this.selectedConfiguration instanceof ConfiguredStorageAddonModel) {
                this.selectedConfiguration.rootFolder = (args as ConfiguredAddonEditableAttrs).rootFolder;
                this.selectedConfiguration.displayName = args.displayName;
                await this.selectedConfiguration.save();
                this.toast.success(this.intl.t('addons.configure.success', {
                    configurationName: this.selectedConfiguration.displayName,
                }));
            }
            this.cancelSetup();
        } catch(e) {
            this.toast.error(this.intl.t('addons.configure.error', {
                configurationName: this.selectedConfiguration?.displayName,
            }));
        }
    }

    @action
    selectAccount(account: AuthorizedStorageAccountModel) {
        this.selectedAccount = account;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.initialize).perform();
    }

    @task
    @waitFor
    async initialize() {
        await taskFor(this.getServiceNode).perform();
        await taskFor(this.getStorageAddonProviders).perform();
    }

    @task
    @waitFor
    async getServiceNode() {
        const references = await this.store.query('resource-reference', {
            filter: {resource_uri: this.node.links.iri},
        });
        if(references) {
            this.addonServiceNode = references.firstObject;
        }
    }

    @task
    @waitFor
    async getStorageAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.STORAGE];

        if (this.addonServiceNode) {
            const configuredAddons = await this.addonServiceNode.configuredStorageAddons;
            activeFilterObject.configuredAddons = A(configuredAddons.toArray());
        }

        const serviceStorageProviders: Provider[] =
            await taskFor(this.getExternalProviders)
                .perform(activeFilterObject.modelName, activeFilterObject.configuredAddons);
        activeFilterObject.list = A(serviceStorageProviders.sort(this.providerSorter));
    }

    @task
    @waitFor
    async getCloudComputingProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];

        if (this.addonServiceNode) {
            const configuredAddons = await this.addonServiceNode.configuredComputingAddons;
            activeFilterObject.configuredAddons = A(configuredAddons.toArray());
        }

        const cloudComputingProviders: Provider[] =
            await taskFor(this.getExternalProviders)
                .perform(activeFilterObject.modelName, activeFilterObject.configuredAddons);
        activeFilterObject.list = cloudComputingProviders.sort(this.providerSorter);
    }

    @task
    @waitFor
    async getCitationAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];

        if (this.addonServiceNode) {
            const configuredAddons = await this.addonServiceNode.configuredCitationAddons;
            activeFilterObject.configuredAddons = A(configuredAddons.toArray());
        }

        const serviceCloudComputingProviders: Provider[] =
            await taskFor(this.getExternalProviders)
                .perform(activeFilterObject.modelName, activeFilterObject.configuredAddons);
        activeFilterObject.list = serviceCloudComputingProviders.sort(this.providerSorter);
    }

    providerSorter(a: Provider, b: Provider) {
        return a.provider.displayName.localeCompare(b.provider.displayName);
    }

    get projectEnabledAddons(): ConfiguredStorageAddonModel[] {
        return this.serviceProjectEnabledAddons();
    }

    get headingText() {
        const providerName = this.selectedProvider?.provider.displayName;
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
        case PageMode.CONFIGURATION_LIST:
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
    async getExternalProviders(providerType: string, configuredAddons?: EmberArray<AllConfiguredAddonTypes>) {
        const serviceProviderModels = (await this.store.findAll(providerType)).toArray();
        const serviceProviders = [] as Provider[];
        for (const provider of serviceProviderModels) {
            serviceProviders.addObject(new Provider(provider, this.currentUser, this.node, configuredAddons));
        }
        return serviceProviders;
    }

    serviceProjectEnabledAddons() {
        return this.addonServiceNode?.get('configuredStorageAddons').toArray() || [];
    }
}
