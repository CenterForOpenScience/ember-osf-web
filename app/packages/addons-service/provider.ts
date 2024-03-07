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
import ConfiguredCitationServiceAddonModel from 'ember-osf-web/models/configured-citation-service-addon';
import ConfiguredCloudComputingAddonModel from 'ember-osf-web/models/configured-cloud-computing-addon';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import AuthorizedCitationServiceAccountModel from 'ember-osf-web/models/authorized-citation-service-account';
import AuthorizedCloudComputingAccount from 'ember-osf-web/models/authorized-cloud-computing-account';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import CloudComputingServiceModel from 'ember-osf-web/models/cloud-computing-service';
import CitationServiceModel from 'ember-osf-web/models/citation-service';

export type AllProviderTypes = ExternalStorageServiceModel | CloudComputingServiceModel | CitationServiceModel;
export type AllAuthorizedAccountTypes =
    AuthorizedStorageAccountModel |
    AuthorizedCitationServiceAccountModel |
    AuthorizedCloudComputingAccount;
export type AllConfiguredAddonTypes =
    ConfiguredStorageAddonModel |
    ConfiguredCitationServiceAddonModel |
    ConfiguredCloudComputingAddonModel;

interface ProviderTypeMapper {
    getConfiguredAddon: Task<any, any>;
    getAuthorizedAccounts: Task<any, any>;
    createAccountForNodeAddon: Task<any, any>;
    createConfiguredAddon: Task<any, any>;
}


export default class Provider {
    @tracked node: NodeModel;
    @tracked serviceNode?: ResourceReferenceModel;

    currentUser: CurrentUserService;
    @tracked userReference!: UserReferenceModel;
    provider: AllProviderTypes;
    providerMap?: ProviderTypeMapper;

    providerTypeMapper: Record<string, ProviderTypeMapper>  = {
        externalStorageService: {
            getConfiguredAddon: taskFor(this.getConfiguredStorageAddon),
            getAuthorizedAccounts: taskFor(this.getAuthorizedStorageAccounts),
            createAccountForNodeAddon: taskFor(this.createAuthorizedStorageAccount),
            createConfiguredAddon: taskFor(this.createConfiguredStorageAddon),
        },
        cloudComputingService: {
            getConfiguredAddon: taskFor(this.getConfiguredCloudComputingAddon),
            getAuthorizedAccounts: taskFor(this.getAuthorizedCloudComputingAccounts),
            createAccountForNodeAddon: taskFor(this.createAuthorizedCloudComputingAccount),
            createConfiguredAddon: taskFor(this.createConfiguredCloudComputingAddon),
        },
        citationService: {
            getConfiguredAddon: taskFor(this.getConfiguredCitationServiceAddon),
            getAuthorizedAccounts: taskFor(this.getAuthorizedCitationServiceAccounts),
            createAccountForNodeAddon: taskFor(this.createAuthorizedCitationServiceAccount),
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

    constructor(provider: any, currentUser: CurrentUserService, node: NodeModel) {
        setOwner(this, getOwner(node));
        this.node = node;
        this.currentUser = currentUser;
        this.provider = provider;

        if (provider instanceof ExternalStorageServiceModel) {
            this.providerMap = this.providerTypeMapper.externalStorageService;
        } else if (provider instanceof CloudComputingServiceModel) {
            this.providerMap = this.providerTypeMapper.cloudComputingService;
        } else if (provider instanceof CitationServiceModel) {
            this.providerMap = this.providerTypeMapper.citationService;
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
        const serviceNode = this.store.peekRecord('resource-reference', this.node.id);
        if (serviceNode) {
            this.serviceNode = serviceNode;
        } else {
            this.serviceNode = await this.store.findRecord('resource-reference', this.node.id);
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
    async getConfiguredCitationServiceAddon() {
        if (this.serviceNode) {
            await taskFor(this.getConfiguredAddon).perform('configuredCitationServiceAddons');
        }
    }

    @task
    @waitFor
    async getConfiguredCloudComputingAddon() {
        if (this.serviceNode) {
            await taskFor(this.getConfiguredAddon).perform('configuredCloudComputingAddons');
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
    async getAuthorizedCitationServiceAccounts() {
        await taskFor(this.getAuthorizedAccounts).perform('authorizedCitationServiceAccounts',
            { 'filter[citationService]': this.provider.id });
    }

    @task
    @waitFor
    async getAuthorizedCloudComputingAccounts() {
        await taskFor(this.getAuthorizedAccounts).perform('authorizedCloudComputingAccounts',
            { 'filter[cloudComputingService]': this.provider.id });
    }

    @task
    @waitFor
    async getAuthorizedAccounts(accountType: RelationshipsFor<UserReferenceModel>, filter: any) {
        if (this.userReference){
            this.authorizedAccounts = await this.userReference.queryHasMany(accountType, filter);
        }
    }

    async userAddonAccounts() {
        return await this.userReference.authorizedStorageAccounts;
    }


    @task
    @waitFor
    async createAuthorizedStorageAccount() {
        return await taskFor(this.createAccountForNodeAddon).perform('authorized-storage-account');
    }

    @task
    @waitFor
    async createAuthorizedCitationServiceAccount() {
        return await taskFor(this.createAccountForNodeAddon).perform('authorized-citation-service-account');
    }

    @task
    @waitFor
    async createAuthorizedCloudComputingAccount() {
        return await taskFor(this.createAccountForNodeAddon).perform('authorized-cloud-computing-account');
    }

    @task
    @waitFor
    async createAccountForNodeAddon(authorizedAccountType: string) {
        const account = this.store.createRecord(authorizedAccountType, {
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            storageProvider: this.provider,
            configuringUser: this.userReference,
        });
        await account.save();
        return account;
    }

    @task
    @waitFor
    async createConfiguredStorageAddon(account: AuthorizedStorageAccountModel) {
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
    async createConfiguredCitationAddon(account: AuthorizedCitationServiceAccountModel) {
        if (!this.configuredAddon) {
            const configuredCitationAddon = this.store.createRecord('configured-citation-service-addon', {
                storageProvider: this.provider,
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
    async createConfiguredCloudComputingAddon(account: AuthorizedCloudComputingAccount) {
        if (!this.configuredAddon) {
            const configuredCloudComputingAddon = this.store.createRecord('configured-cloud-computing-addon', {
                storageProvider: this.provider,
                accountOwner: this.userReference,
                authorizedResource: this.serviceNode,
                baseAccount: account,
            });
            await configuredCloudComputingAddon.save();
            this.configuredAddon = configuredCloudComputingAddon;
        }
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
