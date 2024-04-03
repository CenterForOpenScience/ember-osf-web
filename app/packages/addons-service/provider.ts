import { getOwner, setOwner } from '@ember/application';
import ArrayProxy from '@ember/array/proxy';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { Task, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { RelationshipsFor } from 'ember-data';

import NodeModel from 'ember-osf-web/models/node';
import CurrentUserService from 'ember-osf-web/services/current-user';
import UserReferenceModel from 'ember-osf-web/models/user-reference';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';
import AuthorizedStorageAccountModel, {AddonCredentialFields} from 'ember-osf-web/models/authorized-storage-account';
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
    getConfiguredAddon: Task<any, any>;
    getAuthorizedAccounts: Task<any, any>;
    createAccountForNodeAddon: Task<any, any>;
    createConfiguredAddon: Task<any, any>;
}


export default class Provider {
    @tracked node?: NodeModel;
    @tracked serviceNode?: ResourceReferenceModel;

    currentUser: CurrentUserService;
    @tracked userReference?: UserReferenceModel;
    provider: AllProviderTypes;
    providerMap?: ProviderTypeMapper;

    get name() {
        return this.provider.name;
    }

    providerTypeMapper: Record<string, ProviderTypeMapper>  = {
        externalStorageService: {
            getConfiguredAddon: taskFor(this.getConfiguredStorageAddon),
            getAuthorizedAccounts: taskFor(this.getAuthorizedStorageAccounts),
            createAccountForNodeAddon: taskFor(this.createAuthorizedStorageAccount),
            createConfiguredAddon: taskFor(this.createConfiguredStorageAddon),
        },
        externalComputingService: {
            getConfiguredAddon: taskFor(this.getConfiguredComputingAddon),
            getAuthorizedAccounts: taskFor(this.getAuthorizedComputingAccounts),
            createAccountForNodeAddon: taskFor(this.createAuthorizedComputingAccount),
            createConfiguredAddon: taskFor(this.createConfiguredComputingAddon),
        },
        externalCitationService: {
            getConfiguredAddon: taskFor(this.getConfiguredCitationAddon),
            getAuthorizedAccounts: taskFor(this.getAuthorizedCitationAccounts),
            createAccountForNodeAddon: taskFor(this.createAuthorizedCitationAccount),
            createConfiguredAddon: taskFor(this.createConfiguredCitationAddon),
        },
    };

    @tracked configuredAddon?: AllConfiguredAddonTypes;
    @tracked authorizedAccount?: AllAuthorizedAccountTypes;
    @tracked authorizedAccounts?: AllAuthorizedAccountTypes[];

    @service store!: Store;

    get isConfigured() {
        return Boolean(this.configuredAddon);
    }

    constructor(provider: any, currentUser: CurrentUserService, node?: NodeModel) {
        setOwner(this, getOwner(provider));
        this.node = node;
        this.currentUser = currentUser;
        this.provider = provider;

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
        await taskFor(this.providerMap!.getConfiguredAddon).perform();
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

    @task
    @waitFor
    async getConfiguredStorageAddon() {
        if (this.serviceNode) {
            await taskFor(this.getConfiguredAddon).perform('configuredStorageAddons');
        }
    }

    @task
    @waitFor
    async getConfiguredCitationAddon() {
        if (this.serviceNode) {
            await taskFor(this.getConfiguredAddon).perform('configuredCitationAddons');
        }
    }

    @task
    @waitFor
    async getConfiguredComputingAddon() {
        if (this.serviceNode) {
            await taskFor(this.getConfiguredAddon).perform('configuredComputingAddons');
        }
    }

    @task
    @waitFor
    async getConfiguredAddon(configuredAddonType: RelationshipsFor<ResourceReferenceModel>) {
        if (this.serviceNode) {
            const configuredAddons = await this.serviceNode[configuredAddonType] as ArrayProxy<AllConfiguredAddonTypes>;
            const currentProviderConfiguredAddon = configuredAddons.filter(
                (addon: any) => addon.name === this.provider.id,
            );
            if (currentProviderConfiguredAddon.length > 0) {
                this.configuredAddon = currentProviderConfiguredAddon[0];
            }
        }
    }

    @task
    @waitFor
    async getAuthorizedStorageAccounts() {
        await taskFor(this.getAuthorizedAccounts).perform('authorizedStorageAccounts',
            { 'filter[storageProvider]': this.provider.id });
    }

    @task
    @waitFor
    async getAuthorizedCitationAccounts() {
        await taskFor(this.getAuthorizedAccounts).perform('authorizedCitationAccounts',
            { 'filter[externalCitationService]': this.provider.id });
    }

    @task
    @waitFor
    async getAuthorizedComputingAccounts() {
        await taskFor(this.getAuthorizedAccounts).perform('authorizedComputingAccounts',
            { 'filter[externalComputingService]': this.provider.id });
    }

    @task
    @waitFor
    async getAuthorizedAccounts(accountType: RelationshipsFor<UserReferenceModel>, filter: any) {
        if (this.userReference){
            this.authorizedAccounts = await this.userReference.queryHasMany(accountType, filter);
        }
    }

    async userAddonAccounts() {
        return await this.userReference?.authorizedStorageAccounts;
    }


    @task
    @waitFor
    private async createAuthorizedStorageAccount(credentials: AddonCredentialFields) {
        const newAccount = this.store.createRecord('authorized-storage-account', {
            credentials,
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            storageProvider: this.provider,
            configuringUser: this.userReference,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    private async createAuthorizedCitationAccount(credentials: AddonCredentialFields) {
        const newAccount = this.store.createRecord('authorized-citation-account', {
            credentials,
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            citationService: this.provider,
            configuringUser: this.userReference,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    private async createAuthorizedComputingAccount(credentials: AddonCredentialFields) {
        const newAccount = this.store.createRecord('authorized-computing-account', {
            credentials,
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            computingService: this.provider,
            configuringUser: this.userReference,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    public async createAccountForNodeAddon(credentials: AddonCredentialFields) {
        return await taskFor(this.providerMap!.createAccountForNodeAddon).perform(credentials);
    }

    @task
    @waitFor
    private async createConfiguredStorageAddon(account: AuthorizedStorageAccountModel) {
        if (!this.configuredAddon) {
            const configuredStorageAddon = this.store.createRecord('configured-storage-addon', {
                rootFolder: '',
                storageProvider: this.provider,
                accountOwner: this.userReference,
                authorizedResource: this.serviceNode,
                baseAccount: account,
            });
            await configuredStorageAddon.save();
            this.configuredAddon = configuredStorageAddon;
        }
    }

    @task
    @waitFor
    private async createConfiguredCitationAddon(account: AuthorizedCitationAccountModel) {
        if (!this.configuredAddon) {
            const configuredCitationAddon = this.store.createRecord('configured-citation-addon', {
                citationService: this.provider,
                accountOwner: this.userReference,
                authorizedResource: this.serviceNode,
                baseAccount: account,
            });
            await configuredCitationAddon.save();
            this.configuredAddon = configuredCitationAddon;
        }
    }

    @task
    @waitFor
    private async createConfiguredComputingAddon(account: AuthorizedComputingAccount) {
        if (!this.configuredAddon) {
            const configuredComputingAddon = this.store.createRecord('configured-computing-addon', {
                computingService: this.provider,
                accountOwner: this.userReference,
                authorizedResource: this.serviceNode,
                baseAccount: account,
            });
            await configuredComputingAddon.save();
            this.configuredAddon = configuredComputingAddon;
        }
    }

    @task
    @waitFor
    public async createConfiguredAddon(account: AllAuthorizedAccountTypes) {
        return await taskFor(this.providerMap!.createConfiguredAddon).perform(account);
    }

    @task
    @waitFor
    async setNodeAddonCredentials(account: AllAuthorizedAccountTypes) {
        if (this.configuredAddon) {
            // @ts-ignore: Can ignore as AuthorizedXYZAccount and ConfiguredXYZAddon types *should* match up here
            this.configuredAddon.set('baseAccount', account);
        }
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
