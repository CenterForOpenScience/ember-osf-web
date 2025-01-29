import { getOwner, setOwner } from '@ember/application';
import EmberArray from '@ember/array';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { Task, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import NodeModel from 'ember-osf-web/models/node';
import CurrentUserService from 'ember-osf-web/services/current-user';
import UserReferenceModel from 'ember-osf-web/models/user-reference';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import ConfiguredCitationAddonModel from 'ember-osf-web/models/configured-citation-addon';
import ConfiguredComputingAddonModel from 'ember-osf-web/models/configured-computing-addon';
import { AccountCreationArgs } from 'ember-osf-web/models/authorized-account';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import AuthorizedCitationAccountModel from 'ember-osf-web/models/authorized-citation-account';
import AuthorizedComputingAccountModel from 'ember-osf-web/models/authorized-computing-account';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import ExternalComputingServiceModel from 'ember-osf-web/models/external-computing-service';
import ExternalCitationServiceModel from 'ember-osf-web/models/external-citation-service';
import { notifyPropertyChange } from '@ember/object';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export type AllProviderTypes =
    ExternalStorageServiceModel |
    ExternalComputingServiceModel |
    ExternalCitationServiceModel;
export type AllAuthorizedAccountTypes =
    AuthorizedStorageAccountModel |
    AuthorizedCitationAccountModel |
    AuthorizedComputingAccountModel;
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
    @service toast!: Toast;
    @service intl!: Intl;

    @tracked node?: NodeModel;
    @tracked serviceNode?: ResourceReferenceModel;

    currentUser: CurrentUserService;
    @tracked userReference!: UserReferenceModel;
    provider: AllProviderTypes;
    private providerMap?: ProviderTypeMapper;

    get displayName() {
        return this.provider.displayName;
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
    @tracked authorizedAccount?: AllAuthorizedAccountTypes;
    @tracked authorizedAccounts?: AllAuthorizedAccountTypes[];

    @service store!: Store;

    get isConfigured() {
        return Boolean(this.configuredAddons?.length);
    }

    get isOwned() {
        if (this.node?.userHasAdminPermission) {
            return true;
        }
        if (!this.configuredAddons || this.configuredAddons.length === 0) {
            return true;
        }
        if (!this.userReference) {
            return false;
        }
        return this.configuredAddons?.any(
            addon => addon.currentUserIsOwner,
        );
    }

    constructor(
        provider: any,
        currentUser: CurrentUserService,
        node?: NodeModel,
        allConfiguredAddons?: EmberArray<AllConfiguredAddonTypes>,
        resourceReference?: ResourceReferenceModel,
        userReference?: UserReferenceModel,
    ) {
        setOwner(this, getOwner(provider));
        this.node = node;
        this.currentUser = currentUser;
        this.provider = provider;
        this.configuredAddons = allConfiguredAddons?.filter(addon => addon.externalServiceId === this.provider.id);
        this.serviceNode = resourceReference;
        if (userReference) {
            this.userReference = userReference;
        }

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
    }

    @task
    @waitFor
    async removeConfiguredAddon(selectedConfiguration: AllConfiguredAddonTypes) {
        const errorMessage = this.intl.t('addons.provider.remove-configured-addon-error');
        const successMessage = this.intl.t('addons.provider.remove-configured-addon-success');
        try {
            await selectedConfiguration?.destroyRecord();
            this.configuredAddons?.removeObject(selectedConfiguration);
            notifyPropertyChange(this, 'configuredAddons');
            this.toast.success(successMessage);
        }  catch (e) {
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            return;
        }
    }

    @task
    @waitFor
    async getUserReference() {
        if (this.userReference){
            return;
        }
        const { user } = this.currentUser;
        const userReferences = await this.store.query('user-reference', {
            filter: {user_uri: user?.links.iri?.toString()},
        });
        this.userReference = userReferences.firstObject;
    }


    @task
    @waitFor
    async getResourceReference() {
        if (this.node && !this.serviceNode) {
            const resourceRefs = await this.store.query('resource-reference', {
                filter: {resource_uri: this.node.links.iri?.toString()},
            });
            this.serviceNode = resourceRefs.firstObject;
        }
    }

    @task
    @waitFor
    async getAuthorizedStorageAccounts() {
        const authorizedStorageAccounts = await this.userReference.authorizedStorageAccounts;
        this.authorizedAccounts = authorizedStorageAccounts
            .filterBy('externalStorageService.id', this.provider.id).toArray();
    }

    @task
    @waitFor
    async getAuthorizedCitationAccounts() {
        const authorizedCitationAccounts = await this.userReference.authorizedCitationAccounts;
        this.authorizedAccounts = authorizedCitationAccounts
            .filterBy('externalCitationService.id', this.provider.id).toArray();
    }

    @task
    @waitFor
    async getAuthorizedComputingAccounts() {
        const authorizedComputingAccounts = await this.userReference.authorizedComputingAccounts;
        this.authorizedAccounts = authorizedComputingAccounts
            .filterBy('externalComputingService.id', this.provider.id).toArray();
    }

    @task
    @waitFor
    async getAuthorizedAccounts() {
        await this.providerMap?.getAuthorizedAccounts.perform();
    }

    async userAddonAccounts() {
        return await this.userReference.authorizedStorageAccounts;
    }


    @task
    @waitFor
    private async createAuthorizedStorageAccount(arg: AccountCreationArgs) {
        const { credentials, apiBaseUrl, displayName, initiateOauth } = arg;
        const newAccount = this.store.createRecord('authorized-storage-account', {
            credentials,
            initiateOauth,
            apiBaseUrl,
            externalUserId: this.currentUser.user?.id,
            authorizedCapabilities: ['ACCESS', 'UPDATE'],
            externalStorageService: this.provider,
            displayName,
            accountOwner: this.userReference,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    private async createAuthorizedCitationAccount(arg: AccountCreationArgs) {
        const { credentials, apiBaseUrl, displayName, initiateOauth } = arg;
        const newAccount = this.store.createRecord('authorized-citation-account', {
            credentials,
            apiBaseUrl,
            initiateOauth,
            externalUserId: this.currentUser.user?.id,
            authorizedCapabilities: ['ACCESS', 'UPDATE'],
            scopes: [],
            externalCitationService: this.provider,
            accountOwner: this.userReference,
            displayName,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    private async createAuthorizedComputingAccount(arg: AccountCreationArgs) {
        const { credentials, apiBaseUrl, displayName, initiateOauth } = arg;
        const newAccount = this.store.createRecord('authorized-computing-account', {
            credentials,
            apiBaseUrl,
            initiateOauth,
            externalUserId: this.currentUser.user?.id,
            authorizedCapabilities: ['ACCESS', 'UPDATE'],
            scopes: [],
            externalComputingService: this.provider,
            accountOwner: this.userReference,
            displayName,
        });
        await newAccount.save();
        return newAccount;
    }

    @task
    @waitFor
    public async createAuthorizedAccount(arg: AccountCreationArgs) {
        return await taskFor(this.providerMap!.createAuthorizedAccount)
            .perform(arg);
    }

    @task
    @waitFor
    public async reconnectAuthorizedAccount(args: AccountCreationArgs, account: AllAuthorizedAccountTypes) {
        const { credentials, apiBaseUrl, displayName } = args;
        account.credentials = credentials;
        account.apiBaseUrl = apiBaseUrl;
        account.displayName = displayName;
        await account.save();
        await account.reload();
    }

    @task
    @waitFor
    private async createConfiguredStorageAddon(account: AuthorizedStorageAccountModel) {
        const configuredStorageAddon = this.store.createRecord('configured-storage-addon', {
            rootFolder: '',
            externalStorageService: this.provider,
            accountOwner: this.userReference,
            authorizedResourceUri: this.node!.links.iri,
            baseAccount: account,
            connectedCapabilities: ['ACCESS', 'UPDATE'],
        });
        return await configuredStorageAddon.save();
    }

    @task
    @waitFor
    private async createConfiguredCitationAddon(account: AuthorizedCitationAccountModel) {
        const configuredCitationAddon = this.store.createRecord('configured-citation-addon', {
            rootFolder: '',
            externalCitationService: this.provider,
            accountOwner: this.userReference,
            authorizedResourceUri: this.node!.links.iri,
            baseAccount: account,
            connectedCapabilities: ['ACCESS', 'UPDATE'],
        });
        return await configuredCitationAddon.save();
    }

    @task
    @waitFor
    private async createConfiguredComputingAddon(account: AuthorizedComputingAccountModel) {
        const configuredComputingAddon = this.store.createRecord('configured-computing-addon', {
            // rootFolder: '',
            externalComputingService: this.provider,
            accountOwner: this.userReference,
            // authorizedResource: this.serviceNode,
            authorizedResourceUri: this.node!.links.iri,
            baseAccount: account,
            connectedCapabilities: ['ACCESS', 'UPDATE'],
        });
        return await configuredComputingAddon.save();
    }

    @task
    @waitFor
    public async createConfiguredAddon(account: AllAuthorizedAccountTypes) {
        const newConfiguredAddon = await taskFor(this.providerMap!.createConfiguredAddon).perform(account);
        this.configuredAddons!.pushObject(newConfiguredAddon);
        return newConfiguredAddon;
    }

    @task
    @waitFor
    async disableProjectAddon() {
        if (this.configuredAddon) {
            await this.configuredAddon.destroyRecord();
            this.configuredAddon = undefined;
        }
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
