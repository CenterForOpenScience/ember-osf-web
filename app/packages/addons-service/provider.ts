import { getOwner, setOwner } from '@ember/application';
import EmberArray from '@ember/array';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { Task, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import NodeModel from 'ember-osf-web/models/node';
import CurrentUserService from 'ember-osf-web/services/current-user';
import UserReferenceModel from 'ember-osf-web/models/user-reference';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';
import { AddonCredentialFields} from 'ember-osf-web/models/authorized-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccount from 'ember-osf-web/models/authorized-computing-account';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import ExternalComputingServiceModel from 'ember-osf-web/models/external-computing-service';
import ExternalCitationServiceModel from 'ember-osf-web/models/external-citation-service';

export type AllProviderTypes =
    ExternalStorageServiceModel |
    ExternalComputingServiceModel |
    ExternalCitationServiceModel;
export type AllAuthorizedAccountTypes =
    AuthorizedStorageAccountModel |
    AuthorizedCitationAccountModel |
    AuthorizedComputingAccount;
export type AllConfiguredAddonTypes =
    ConfiguredStorageAddonModel |
    ConfiguredCitationAddonModel |
    ConfiguredComputingAddonModel;

interface ProviderTypeMapper {
    getAuthorizedAccounts: Task<any, any>;
    createAuthorizedAccount: Task<any, any>;
    createConfiguredAddon: Task<any, any>;
}


export default class Provider {
    @tracked node?: NodeModel;
    @tracked serviceNode?: ResourceReferenceModel;

    currentUser: CurrentUserService;
    @tracked userReference!: UserReferenceModel;
    provider: AllProviderTypes;
    private providerMap?: ProviderTypeMapper;

    get name() {
        return this.provider.name;
    }

    get id() {
        return this.provider.id;
    }

    providerTypeMapper: Record<string, ProviderTypeMapper>  = {
        externalStorageService: {
            getAuthorizedAccounts: taskFor(this.getAuthorizedStorageAccounts),
            createAuthorizedAccount: taskFor(this.createAuthorizedStorageAccount),
            createConfiguredAddon: taskFor(this.createConfiguredStorageAddon),
        },
        externalComputingService: {
            getAuthorizedAccounts: taskFor(this.getAuthorizedComputingAccounts),
            createAuthorizedAccount: taskFor(this.createAuthorizedComputingAccount),
            createConfiguredAddon: taskFor(this.createConfiguredComputingAddon),
        },
        externalCitationService: {
            getAuthorizedAccounts: taskFor(this.getAuthorizedCitationAccounts),
            createAuthorizedAccount: taskFor(this.createAuthorizedCitationAccount),
            createConfiguredAddon: taskFor(this.createConfiguredCitationAddon),
        },
    };

    @tracked configuredAddon?: AllConfiguredAddonTypes;
    @tracked configuredAddons?: AllConfiguredAddonTypes[];
    @tracked allConfiguredAddons?: EmberArray<AllConfiguredAddonTypes>;
    @tracked authorizedAccount?: AllAuthorizedAccountTypes;
    @tracked authorizedAccounts?: AllAuthorizedAccountTypes[];

    @service store!: Store;

    get isConfigured() {
        return Boolean(this.configuredAddon) || Boolean(this.configuredAddons?.length);
    }

    constructor(
        provider: any,
        currentUser: CurrentUserService,
        node?: NodeModel,
        configuredAddons?: EmberArray<AllConfiguredAddonTypes>,
    ) {
        setOwner(this, getOwner(provider));
        this.node = node;
        this.currentUser = currentUser;
        this.provider = provider;
        this.allConfiguredAddons = configuredAddons;

        if (provider instanceof ExternalStorageServiceModel) {
            this.providerMap = this.providerTypeMapper.externalStorageService;
        } else if (provider instanceof ExternalComputingServiceModel) {
            this.providerMap = this.providerTypeMapper.externalComputingService;
        } else if (provider instanceof ExternalCitationServiceModel) {
            this.providerMap = this.providerTypeMapper.externalCitationService;
        }
        taskFor(this.initialize).perform();
    }

    @task
    @waitFor
    async initialize() {
        await taskFor(this.getUserReference).perform();
        await taskFor(this.getResourceReference).perform();
        this.getProviderConfiguredAddons();
    }

    @task
    @waitFor
    async getUserReference() {
        const userReference = this.store.peekRecord('user-reference', this.currentUser.user?.id);
        if (userReference) {
            this.userReference = userReference;
        } else {
            this.userReference = await this.store.findRecord('user-reference', this.currentUser.user?.id);
        }
    }

    @task
    @waitFor
    async getResourceReference() {
        if (this.node) {
            const serviceNode = this.store.peekRecord('resource-reference', this.node.id);
            if (serviceNode) {
                this.serviceNode = serviceNode;
            } else {
                this.serviceNode = await this.store.findRecord('resource-reference', this.node.id);
            }
        }
    }

    getProviderConfiguredAddons() {
        this.configuredAddons = this.allConfiguredAddons?.filter(addon => addon.name === this.name);
    }

    @task
    @waitFor
    async getAuthorizedStorageAccounts() {
        const authorizedStorageAccounts = await this.userReference.authorizedStorageAccounts;
        this.authorizedAccounts = authorizedStorageAccounts
            .filterBy('storageProvider.id', this.provider.id).toArray();
    }

    @task
    @waitFor
    async getAuthorizedCitationAccounts() {
        const authorizedCitationAccounts = await this.userReference.authorizedCitationAccounts;
        this.authorizedAccounts = authorizedCitationAccounts
            .filterBy('citationService.id', this.provider.id).toArray();
    }

    @task
    @waitFor
    async getAuthorizedComputingAccounts() {
        const authorizedComputingAccounts = await this.userReference.authorizedComputingAccounts;
        this.authorizedAccounts = authorizedComputingAccounts
            .filterBy('computingService.id', this.provider.id).toArray();
    }

    @task
    @waitFor
    async getAuthorizedAccounts() {
        this.providerMap?.getAuthorizedAccounts.perform();
    }

    async userAddonAccounts() {
        return await this.userReference.authorizedStorageAccounts;
    }


    @task
    @waitFor
    private async createAuthorizedStorageAccount(
        credentials: AddonCredentialFields, accountName: string, initiateOauth?: boolean,
    ) {
        const newAccount = this.store.createRecord('authorized-storage-account', {
            credentials,
            initiateOauth: initiateOauth || false,
            apiBaseUrl: (this.provider as ExternalStorageServiceModel).configurableApiRoot ? credentials.url : '',
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            storageProvider: this.provider,
            configuringUser: this.userReference,
            displayName: accountName,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    private async createAuthorizedCitationAccount(
        credentials: AddonCredentialFields, accountName: string, initiateOauth?: boolean,
    ) {
        const newAccount = this.store.createRecord('authorized-citation-account', {
            credentials,
            initiateOauth: initiateOauth || false,
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            citationService: this.provider,
            configuringUser: this.userReference,
            displayName: accountName,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    private async createAuthorizedComputingAccount(
        credentials: AddonCredentialFields, accountName: string, initiateOauth?: boolean,
    ) {
        const newAccount = this.store.createRecord('authorized-computing-account', {
            credentials,
            initiateOauth: initiateOauth || false,
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            computingService: this.provider,
            configuringUser: this.userReference,
            displayName: accountName,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    public async createAuthorizedAccount(
        credentials: AddonCredentialFields, accountName: string, initiateOauth?: boolean,
    ) {
        return await taskFor(this.providerMap!.createAuthorizedAccount)
            .perform(credentials, accountName, initiateOauth);
    }

    @task
    @waitFor
    public async reconnectAuthorizedAccount(account: AllAuthorizedAccountTypes, credentials: AddonCredentialFields) {
        account.credentials = credentials;
        await account.save();
        await account.reload();
    }

    @task
    @waitFor
    private async createConfiguredStorageAddon(account: AuthorizedStorageAccountModel) {
        const configuredStorageAddon = this.store.createRecord('configured-storage-addon', {
            rootFolder: '',
            storageProvider: this.provider,
            accountOwner: this.userReference,
            authorizedResource: this.serviceNode,
            baseAccount: account,
        });
        await configuredStorageAddon.save();
    }

    @task
    @waitFor
    private async createConfiguredCitationAddon(account: AuthorizedCitationAccountModel) {
        const configuredCitationAddon = this.store.createRecord('configured-citation-addon', {
            citationService: this.provider,
            accountOwner: this.userReference,
            authorizedResource: this.serviceNode,
            baseAccount: account,
        });
        await configuredCitationAddon.save();
    }

    @task
    @waitFor
    private async createConfiguredComputingAddon(account: AuthorizedComputingAccount) {
        const configuredComputingAddon = this.store.createRecord('configured-computing-addon', {
            computingService: this.provider,
            accountOwner: this.userReference,
            authorizedResource: this.serviceNode,
            baseAccount: account,
        });
        await configuredComputingAddon.save();
    }

    @task
    @waitFor
    public async createConfiguredAddon(account: AllAuthorizedAccountTypes) {
        return await taskFor(this.providerMap!.createConfiguredAddon).perform(account);
    }

    @task
    @waitFor
    async disableProjectAddon() {
        if (this.configuredAddon) {
            await this.configuredAddon.destroyRecord();
            this.configuredAddon = undefined;
        }
    }

    listOfFolders() {
        // TODO
        return;
    }

    @task
    @waitFor
    async setRootFolder(newRootFolder: string) {
        if (this.configuredAddon) {
            (this.configuredAddon as ConfiguredStorageAddonModel).rootFolder = newRootFolder;
            await this.configuredAddon.save();
        }
    }
}
