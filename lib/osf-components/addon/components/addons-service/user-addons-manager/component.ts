import EmberArray, { A } from '@ember/array';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import Provider, {AllProviderTypes, AllAuthorizedAccountTypes} from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import AuthorizedAccountModel, { AccountCreationArgs } from 'ember-osf-web/models/authorized-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import UserModel from 'ember-osf-web/models/user';

import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import ExternalComputingServiceModel from 'ember-osf-web/models/external-computing-service';
import ExternalCitationServiceModel from 'ember-osf-web/models/external-citation-service';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import getHref from 'ember-osf-web/utils/get-href';

import { FilterTypes } from '../manager/component';

enum UserSettingPageModes {
    TERMS = 'terms',
    ACCOUNT_CREATE = 'accountCreate',
    ACCOUNT_RECONNECT = 'accountReconnect',
}

interface Args {
    user: UserModel;
}

export default class UserAddonManagerComponent extends Component<Args> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: IntlService;
    @service toast!: Toast;

    user = this.args.user;
    @tracked userReference!: UserReferenceModel;
    @tracked tabIndex = 0;

    possibleFilterTypes = Object.values(FilterTypes);
    @tracked filterTypeMapper = {
        [FilterTypes.STORAGE]: {
            modelName: 'external-storage-service',
            fetchProvidersTask: taskFor(this.getStorageAddonProviders),
            list: A([]) as EmberArray<Provider>,
            getAuthorizedAccountsTask: taskFor(this.getAuthorizedStorageAccounts),
            authorizedAccounts: [] as AuthorizedStorageAccountModel[],
            authorizedServiceIds: [] as string[],
        },
        [FilterTypes.CITATION_MANAGER]: {
            modelName: 'external-citation-service',
            fetchProvidersTask: taskFor(this.getCitationAddonProviders),
            list: A([]) as EmberArray<Provider>,
            getAuthorizedAccountsTask: taskFor(this.getAuthorizedCitationAccounts),
            authorizedAccounts: [] as AuthorizedCitationAccountModel[],
            authorizedServiceIds: [] as string[],
        },
        // [FilterTypes.CLOUD_COMPUTING]: {
        //     modelName: 'external-computing-service',
        //     fetchProvidersTask: taskFor(this.getComputingAddonProviders),
        //     list: A([]) as EmberArray<Provider>,
        //     getAuthorizedAccountsTask: taskFor(this.getAuthorizedComputingAccounts),
        //     authorizedAccounts: [] as AuthorizedComputingAccountModel[],
        //     authorizedServiceIds: [] as string[],
        // },
    };
    @tracked filterText = '';
    @tracked activeFilterType = FilterTypes.STORAGE;

    @tracked selectedProvider?: Provider;
    @tracked selectedAccount?: AllAuthorizedAccountTypes;

    @tracked pageMode?: UserSettingPageModes;

    @action
    changeTab(index: number) {
        this.tabIndex = index;
    }

    @action
    filterByAddonType(type: FilterTypes) {
        if (this.activeFilterType !== type) {
            this.filterText = '';
        }
        this.activeFilterType = type;
        const activeFilterObject = this.filterTypeMapper[type];
        if (activeFilterObject.list.length === 0) {
            activeFilterObject.fetchProvidersTask.perform();
            activeFilterObject.getAuthorizedAccountsTask.perform();
        }
    }

    get currentTypeAuthorizedAccounts() {
        const allAccounts = this.filterTypeMapper[this.activeFilterType].authorizedAccounts;
        const filteredAccounts = (allAccounts as AllAuthorizedAccountTypes[]).filter(
            (account: AllAuthorizedAccountTypes) => {
                const lowerCaseDisplayName = account.displayName.toLowerCase();
                return lowerCaseDisplayName.includes(this.filterText.toLowerCase());
            },
        );
        return filteredAccounts;
    }

    get filteredAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        const possibleProviders = activeFilterObject.list;
        const textFilteredAddons = possibleProviders.filter(
            (provider: Provider) => provider.displayName.toLowerCase().includes(this.filterText.toLowerCase()),
        );
        return textFilteredAddons;
    }

    get currentTypeAuthorizedServiceIds() {
        return this.filterTypeMapper[this.activeFilterType].authorizedServiceIds;
    }

    get currentListIsLoading() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        return activeFilterObject.fetchProvidersTask.isRunning;
    }

    @action
    connectNewProviderAccount(provider: Provider) {
        this.pageMode = UserSettingPageModes.TERMS;
        this.selectedProvider = provider;
    }

    @action
    acceptProviderTerms() {
        this.pageMode = UserSettingPageModes.ACCOUNT_CREATE;
    }

    @action
    navigateToReconnectProviderAccount(account: AllAuthorizedAccountTypes) {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        const possibleProviders = activeFilterObject.list;
        this.pageMode = UserSettingPageModes.ACCOUNT_RECONNECT;
        this.selectedAccount = account;
        let providerId = '';
        const accountType = (account.constructor as typeof AuthorizedAccountModel).modelName;
        switch (accountType) {
        case 'authorized-storage-account':
            providerId = (account as AuthorizedStorageAccountModel).externalStorageService.get('id');
            break;
        case 'authorized-citation-account':
            providerId = (account as AuthorizedCitationAccountModel).externalCitationService.get('id');
            break;
        case 'authorized-computing-account':
            providerId = (account as AuthorizedComputingAccountModel).externalComputingService.get('id');
            break;
        default:
            break;
        }
        this.selectedProvider = possibleProviders.find(provider => provider.id === providerId);
    }

    @action
    cancelSetup() {
        this.pageMode = undefined;
        this.selectedProvider = undefined;
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.initialize).perform();
    }


    @task
    @waitFor
    async initialize() {
        await taskFor(this.getUserReference).perform();
        await taskFor(this.getAuthorizedAccounts).perform();
        await taskFor(this.getAddonProviders).perform();
    }

    @task
    @waitFor
    async getUserReference() {
        const { user } = this;
        const _iri = user.links.iri;
        if (_iri) {
            const userReferences = await this.store.query('user-reference', {
                filter: {user_uri: getHref(_iri)},
            });
            this.userReference = userReferences.firstObject;
        }
    }

    @task
    @waitFor
    async getAuthorizedStorageAccounts() {
        const { userReference } = this;
        const mappedObject = this.filterTypeMapper[FilterTypes.STORAGE];
        const accounts = (await userReference.authorizedStorageAccounts).toArray();
        mappedObject.authorizedAccounts = accounts;
        mappedObject.authorizedServiceIds = accounts.map(account => account.externalStorageService.get('id'));
        notifyPropertyChange(this, 'filterTypeMapper');
    }

    @task
    @waitFor
    async getAuthorizedCitationAccounts() {
        const { userReference } = this;
        const mappedObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];
        const accounts = (await userReference.authorizedCitationAccounts).toArray();
        mappedObject.authorizedAccounts = accounts;
        mappedObject.authorizedServiceIds = accounts.map(account => account.externalCitationService.get('id'));
        notifyPropertyChange(this, 'filterTypeMapper');
    }

    @task
    @waitFor
    async getAuthorizedComputingAccounts() {
        const { userReference } = this;
        const mappedObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];
        const accounts = (await userReference.authorizedComputingAccounts).toArray();
        mappedObject.authorizedAccounts = accounts;
        mappedObject.authorizedServiceIds = accounts.map(account => account.externalComputingService.get('id'));
        notifyPropertyChange(this, 'filterTypeMapper');
    }

    @task
    @waitFor
    async getAuthorizedAccounts() {
        const activeTypeMap = this.filterTypeMapper[this.activeFilterType];
        await taskFor(activeTypeMap.getAuthorizedAccountsTask).perform();
    }

    @task
    @waitFor
    async getStorageAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.STORAGE];
        const serviceStorageProviders = await taskFor(this.getExternalProviders)
            .perform(activeFilterObject.modelName) as ExternalStorageServiceModel[];
        const list = serviceStorageProviders.sort(this.providerSorter)
            .map(provider => new Provider(
                provider,
                this.currentUser,
                undefined,
                undefined,
                undefined,
                this.userReference,
            ));
        activeFilterObject.list = list;
    }

    @task
    @waitFor
    async getComputingAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];
        const serviceComputingProviders = await taskFor(this.getExternalProviders)
            .perform(activeFilterObject.modelName) as ExternalComputingServiceModel[];
        activeFilterObject.list = serviceComputingProviders.sort(this.providerSorter)
            .map(provider => new Provider(
                provider,
                this.currentUser,
                undefined,
                undefined,
                undefined,
                this.userReference,
            ));
    }

    @task
    @waitFor
    async getCitationAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];
        const serviceCitationProviders = await taskFor(this.getExternalProviders)
            .perform(activeFilterObject.modelName) as ExternalCitationServiceModel[];
        activeFilterObject.list = serviceCitationProviders.sort(this.providerSorter)
            .map(provider => new Provider(
                provider,
                this.currentUser,
                undefined,
                undefined,
                undefined,
                this.userReference,
            ));
    }

    @task
    @waitFor
    async getAddonProviders() {
        const activeTypeMap = this.filterTypeMapper[this.activeFilterType];
        await taskFor(activeTypeMap.fetchProvidersTask).perform();
    }

    providerSorter(a: AllProviderTypes, b: AllProviderTypes) {
        return a.displayName.localeCompare(b.displayName);
    }

    @task
    @waitFor
    async getExternalProviders(providerType: string) {
        const serviceProviderModels: AllProviderTypes[] = (await this.store.findAll(providerType)).toArray();
        return serviceProviderModels;
    }

    @task
    @waitFor
    async connectAccount(arg: AccountCreationArgs) {
        if (this.selectedProvider) {
            await taskFor(this.selectedProvider!.createAuthorizedAccount)
                .perform(arg);
            this.cancelSetup();
            this.changeTab(1);
            await taskFor(this.getAuthorizedAccounts).perform();
        }
    }

    @task
    @waitFor
    async reconnectAccount(args: AccountCreationArgs) {
        if (this.selectedProvider && this.selectedAccount) {
            await taskFor(this.selectedProvider.reconnectAuthorizedAccount)
                .perform(args, this.selectedAccount);
            this.cancelSetup();
            await taskFor(this.getAuthorizedAccounts).perform();
        }
    }

    @task
    @waitFor
    async createAuthorizedAccount(args: AccountCreationArgs) {
        if (this.selectedProvider) {
            return await taskFor(this.selectedProvider.createAuthorizedAccount)
                .perform(args);
        }
    }

    @task
    @waitFor
    async oauthFlowRefocus(newAccount: AllAuthorizedAccountTypes): Promise<boolean> {
        await newAccount.reload();
        if (newAccount.credentialsAvailable) {
            this.cancelSetup();
            this.changeTab(1);
            await taskFor(this.getAuthorizedAccounts).perform();
            return true;
        }
        return false;
    }

    @task
    @waitFor
    async disconnectAccount(account: AllAuthorizedAccountTypes) {
        try {
            const authorizedAccounts = this.filterTypeMapper[this.activeFilterType]
                .authorizedAccounts as AllAuthorizedAccountTypes[];
            authorizedAccounts.removeObject(account);
            await account.destroyRecord();
            await taskFor(this.filterTypeMapper[this.activeFilterType].getAuthorizedAccountsTask).perform();
            this.toast.success(this.intl.t('addons.accountCreate.disconnect-success'));
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e), this.intl.t('addons.accountCreate.disconnect-error'));
        }
    }
}
