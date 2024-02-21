import EmberArray, { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';

import UserReferenceModel from 'ember-osf-web/models/user-reference';
import Provider from 'ember-osf-web/packages/addons-service/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import UserModel from 'ember-osf-web/models/user';

import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import CloudComputingServiceModel from 'ember-osf-web/models/cloud-computing-service';
import CitationServiceModel from 'ember-osf-web/models/citation-service';

import { FilterTypes } from '../manager/component';

type AllProviderTypes = ExternalStorageServiceModel | CloudComputingServiceModel | CitationServiceModel;

interface Args {
    user: UserModel;
}

export default class UserAddonManagerComponent extends Component<Args> {
    @service store!: Store;
    @service currentUser!: CurrentUserService;
    @service intl!: IntlService;

    user = this.args.user;
    @tracked userReference?: UserReferenceModel;

    filterTypeMapper = {
        [FilterTypes.STORAGE]: {
            modelName: 'external-storage-service',
            userRelationshipName: 'authorizedStorageAccounts',
            fetchProvidersTask: taskFor(this.getStorageAddonProviders),
            list: A([]) as EmberArray<AllProviderTypes>,
            authorizedAccounts: A([]) as EmberArray<AuthorizedStorageAccountModel>,
        },
        [FilterTypes.CITATION_MANAGER]: {
            modelName: 'citation-service',
            fetchProvidersTask: taskFor(this.getCitationAddonProviders),
            list: A([]) as EmberArray<AllProviderTypes>,
            // TODO: add authorizedAccounts for citation manager
        },
        [FilterTypes.CLOUD_COMPUTING]: {
            modelName: 'cloud-service',
            fetchProvidersTask: taskFor(this.getCloudComputingProviders),
            list: A([]) as EmberArray<AllProviderTypes>,
            // TODO: add authorizedAccounts for cloud computing
        },
    };
    @tracked activeFilterType = FilterTypes.STORAGE;

    @tracked selectedProvider?: Provider;
    @tracked selectedAccount?: AuthorizedStorageAccountModel;
    @tracked credentialsObject = {
        username: '',
        password: '',
        token: '',
        key: '',
    };


    get filteredAddonProviders() {
        return this.filterTypeMapper[this.activeFilterType].list;
    }

    get currentListIsLoading() {
        const activeFilterObject = this.filterTypeMapper[this.activeFilterType];
        return activeFilterObject.fetchProvidersTask.isRunning;
    }


    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getUserReference).perform();
        taskFor(this.getStorageAddonProviders).perform();
        taskFor(this.getAuthorizedStorageAccounts).perform();
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
}
