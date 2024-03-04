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
import Provider from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import UserModel from 'ember-osf-web/models/user';

import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import CloudComputingServiceModel from 'ember-osf-web/models/cloud-computing-service';
import CitationServiceModel from 'ember-osf-web/models/citation-service';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { FilterTypes } from '../manager/component';

type AllProviderTypes = ExternalStorageServiceModel | CloudComputingServiceModel | CitationServiceModel;

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
            list: A([]) as EmberArray<AllProviderTypes>,
            authorizedAccounts: [] as AuthorizedStorageAccountModel[],
        },
        [FilterTypes.CITATION_MANAGER]: {
            modelName: 'citation-service',
            fetchProvidersTask: taskFor(this.getCitationAddonProviders),
            list: A([]) as EmberArray<AllProviderTypes>,
            authorizedAccounts: [] as AuthorizedStorageAccountModel[], // TODO: add type
        },
        [FilterTypes.CLOUD_COMPUTING]: {
            modelName: 'cloud-computing-service',
            fetchProvidersTask: taskFor(this.getCloudComputingProviders),
            list: A([]) as EmberArray<AllProviderTypes>,
            authorizedAccounts: [] as AuthorizedStorageAccountModel[], // TODO: add type
        },
    };
    @tracked filterText = '';
    @tracked activeFilterType = FilterTypes.STORAGE;

    @tracked selectedProvider?: Provider;
    @tracked selectedAccount?: AuthorizedStorageAccountModel;
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
        const serviceStorageProviders: AllProviderTypes[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        const sortedList = serviceStorageProviders.sort(this.providerSorter);
        activeFilterObject.list = sortedList;
    }

    @task
    @waitFor
    async getCloudComputingProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CLOUD_COMPUTING];
        const cloudComputingProviders: AllProviderTypes[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = cloudComputingProviders.sort(this.providerSorter);
    }

    @task
    @waitFor
    async getCitationAddonProviders() {
        const activeFilterObject = this.filterTypeMapper[FilterTypes.CITATION_MANAGER];
        const serviceCloudComputingProviders: AllProviderTypes[] =
            await taskFor(this.getExternalProviders).perform(activeFilterObject.modelName);
        activeFilterObject.list = A(serviceCloudComputingProviders.sort(this.providerSorter));
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
    async disconnectAddon(account: AuthorizedStorageAccountModel) {
        try {
            const { authorizedAccounts } = this.filterTypeMapper[this.activeFilterType];
            await account.destroyRecord();
            authorizedAccounts.removeObject(account);
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }
}
