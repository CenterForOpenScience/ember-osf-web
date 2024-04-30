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

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import NodeModel from 'ember-osf-web/models/node';
import Provider, { AllAuthorizedAccountTypes } from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import AuthorizedStorageAccountModel, { AddonCredentialFields } from 'ember-osf-web/models/authorized-storage-account';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

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
    @service toast!: Toast;

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
            modelName: 'external-citation-service',
            task: taskFor(this.getCitationAddonProviders),
            list: A([]),
        },
        [FilterTypes.CLOUD_COMPUTING]: {
            modelName: 'external-computing-service',
            task: taskFor(this.getCloudComputingProviders),
            list: A([]),
        },
    };
    @tracked filterText = '';
    @tracked activeFilterType: FilterTypes = FilterTypes.STORAGE;

    @tracked pageMode?: PageMode;
    @tracked selectedProvider?: Provider;
    @tracked selectedAccount?: AllAuthorizedAccountTypes;
    @tracked credentialsObject: AddonCredentialFields = {
        url: '',
        username: '',
        password: '',
        token: '',
        accessKey: '',
        secretKey: '',
        repo: '',
    };
    @tracked connectAccountError = false;

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
        await taskFor(this.selectedProvider!.providerMap!.getAuthorizedAccounts).perform();
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
    async createAuthorizedAccount() {
        if (this.selectedProvider) {
            const newAccount = await taskFor(this.selectedProvider.providerMap!
                .createAccountForNodeAddon).perform(this.credentialsObject);
            return newAccount;
        }
        return undefined;
    }

    @task
    @waitFor
    async createConfiguredAddon(newAccount: AllAuthorizedAccountTypes) {
        if (this.selectedProvider) {
            await taskFor(this.selectedProvider.providerMap!.createConfiguredAddon).perform(newAccount);
        }
    }

    @task
    @waitFor
    async connectAccount() {
        try {
            if (this.selectedProvider) {
                const newAccount = await taskFor(this.createAuthorizedAccount).perform();
                if (newAccount) {
                    await taskFor(this.createConfiguredAddon).perform(newAccount);
                    this.clearCredentials();
                    this.pageMode = PageMode.CONFIGURE;
                }
            }
        } catch (e) {
            this.connectAccountError = true;
            const errorMessage = this.intl.t('addons.accountCreate.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @task
    @waitFor
    async oauthFlowRefocus(newAccount: AllAuthorizedAccountTypes) {
        await newAccount.reload();
        this.clearCredentials();
        await taskFor(this.selectedProvider!.providerMap!.getAuthorizedAccounts).perform();
        this.selectedAccount = undefined;
        this.chooseExistingAccount();
    }

    @action
    onCredentialsInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.credentialsObject[(input.name as keyof AddonCredentialFields)] = input.value;
    }

    @task
    @waitFor
    async confirmAccountSetup(account: AllAuthorizedAccountTypes) {
        if (this.selectedProvider && this.selectedAccount) {
            await taskFor(this.selectedProvider.createConfiguredAddon).perform(account);
        }
        this.pageMode = PageMode.CONFIGURE;
    }

    @action
    cancelSetup() {
        this.pageMode = undefined;
        this.selectedProvider = undefined;
        this.clearCredentials();
        this.selectedAccount = undefined;
    }

    @action
    clearCredentials() {
        this.connectAccountError = false;
        this.credentialsObject = {
            url: '',
            username: '',
            password: '',
            token: '',
            accessKey: '',
            secretKey: '',
            repo: '',
        };
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
        taskFor(this.getServiceNode).perform();
        taskFor(this.getStorageAddonProviders).perform();
    }

    @task
    @waitFor
    async getServiceNode() {
        const references = await this.store.query('resource-reference', {
            filter: {'resource-uri': encodeURI(this.node.links.iri as string)},
        });
        if(references) {
            this.addonServiceNode = references[0];
        }
    }

    @task
    @waitFor
    async getStorageAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.STORAGE];
        const serviceStorageProviders: Provider[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = A(serviceStorageProviders.sort(this.providerSorter));

        if (this.addonServiceNode) {
            await this.addonServiceNode.get('configuredStorageAddons');
        }
    }

    @task
    @waitFor
    async getCloudComputingProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];
        const cloudComputingProviders: Provider[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = cloudComputingProviders.sort(this.providerSorter);

        if (this.addonServiceNode) {
            await this.addonServiceNode.get('configuredComputingAddons');
        }
    }

    @task
    @waitFor
    async getCitationAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];
        const serviceCloudComputingProviders: Provider[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = serviceCloudComputingProviders.sort(this.providerSorter);

        if (this.addonServiceNode) {
            await this.addonServiceNode.get('configuredCitationAddons');
        }
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