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
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccount from 'ember-osf-web/models/authorized-computing-account';
import UserModel from 'ember-osf-web/models/user';

import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import ExternalComputingServiceModel from 'ember-osf-web/models/external-computing-service';
import ExternalCitationServiceModel from 'ember-osf-web/models/external-citation-service';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { FilterTypes } from '../manager/component';

interface Args {
    user: UserModel;
}

export default class UserAddonManagerComponent extends Component<Args> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: IntlService;
    @service toast!: Toast;

    user = this.args.user;
    @tracked userReference?: UserReferenceModel;

    possibleFilterTypes = Object.values(FilterTypes);
    @tracked filterTypeMapper = {
        [FilterTypes.STORAGE]: {
            modelName: 'external-storage-service',
            userRelationshipName: 'authorizedStorageAccounts',
            fetchProvidersTask: taskFor(this.getStorageAddonProviders),
            list: A([]) as EmberArray<ExternalStorageServiceModel>,
            authorizedAccounts: [] as AuthorizedStorageAccountModel[],
        },
        [FilterTypes.CITATION_MANAGER]: {
            modelName: 'external-citation-service',
            fetchProvidersTask: taskFor(this.getCitationAddonProviders),
            list: A([]) as EmberArray<ExternalCitationServiceModel>,
            authorizedAccounts: [] as AuthorizedCitationAccountModel[],
        },
        [FilterTypes.CLOUD_COMPUTING]: {
            modelName: 'external-computing-service',
            fetchProvidersTask: taskFor(this.getCloudComputingProviders),
            list: A([]) as EmberArray<ExternalComputingServiceModel>,
            authorizedAccounts: [] as AuthorizedComputingAccount[],
        },
    };
    @tracked filterText = '';
    @tracked activeFilterType = FilterTypes.STORAGE;

    @tracked selectedProvider?: Provider;
    @tracked selectedAccount?: AllAuthorizedAccountTypes;
    @tracked credentialsObject = {
        url: '',
        username: '',
        password: '',
        token: '',
        accessKey: '',
        secretKey: '',
        repo: '',
    };

    @action
    filterByAddonType(type: FilterTypes) {
        this.activeFilterType = type;
        const activeFilterObject = this.filterTypeMapper[type];
        if (activeFilterObject.list.length === 0) {
            activeFilterObject.fetchProvidersTask.perform();
        }
    }

    get currentTypeAuthorizedAccounts() {
        return this.filterTypeMapper[this.activeFilterType].authorizedAccounts;
    }

    get filteredAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        const possibleProviders = activeFilterObject.list;
        const textFilteredAddons = possibleProviders.filter(
            (provider: any) => provider.name.toLowerCase().includes(this.filterText.toLowerCase()),
        );
        return textFilteredAddons;
    }

    get currentListIsLoading() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        return activeFilterObject.fetchProvidersTask.isRunning;
    }


    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.initialize).perform();
    }


    @task
    @waitFor
    async initialize() {
        await taskFor(this.getUserReference).perform();
        await taskFor(this.getAuthorizedStorageAccounts).perform();
        await taskFor(this.getStorageAddonProviders).perform();
    }

    @task
    @waitFor
    async getUserReference() {
        const { user } = this;
        const userReference = await this.store.findRecord('user-reference', user.id);
        this.userReference = userReference;
    }

    @task
    @waitFor
    async getAuthorizedStorageAccounts() {
        const { userReference } = this;
        const mappedObject = this.filterTypeMapper[FilterTypes.STORAGE];
        if (userReference) {
            const accounts = (await userReference.authorizedStorageAccounts).toArray();
            mappedObject.authorizedAccounts = accounts;
            notifyPropertyChange(this, 'filterTypeMapper');
        }
    }

    @task
    @waitFor
    async getStorageAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.STORAGE];
        const serviceStorageProviders = await taskFor(this.getExternalProviders)
            .perform(activeFilterObject.modelName) as ExternalStorageServiceModel[];
        activeFilterObject.list = serviceStorageProviders.sort(this.providerSorter);
    }

    @task
    @waitFor
    async getCloudComputingProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];
        const cloudComputingProviders = await taskFor(this.getExternalProviders)
            .perform(activeFilterObject.modelName) as ExternalComputingServiceModel[];
        activeFilterObject.list = cloudComputingProviders.sort(this.providerSorter);
    }

    @task
    @waitFor
    async getCitationAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];
        const serviceCloudComputingProviders = await taskFor(this.getExternalProviders)
            .perform(activeFilterObject.modelName) as ExternalCitationServiceModel[];
        activeFilterObject.list = serviceCloudComputingProviders.sort(this.providerSorter);
    }

    providerSorter(a: AllProviderTypes, b: AllProviderTypes) {
        return a.name.localeCompare(b.name);
    }

    @task
    @waitFor
    async getExternalProviders(providerType: string) {
        const serviceProviderModels: AllProviderTypes[] = (await this.store.findAll(providerType)).toArray();
        return serviceProviderModels;
    }

    @task
    @waitFor
    async connectAccount() {
        if (this.selectedProvider) {
            const newAccount = await taskFor(this.selectedProvider.providerMap!.createAccountForNodeAddon).perform();
            await taskFor(this.selectedProvider.providerMap!.createConfiguredAddon).perform(newAccount);
        }
    }

    @task
    @waitFor
    async disconnectAddon(account: AllAuthorizedAccountTypes) {
        try {
            const authorizedAccounts = this.filterTypeMapper[this.activeFilterType]
                .authorizedAccounts as AllAuthorizedAccountTypes[];
            await account.destroyRecord();
            authorizedAccounts.removeObject(account);
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }
}
