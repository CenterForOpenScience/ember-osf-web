import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import NodeModel from 'ember-osf-web/models/node';
import CurrentUserService from 'ember-osf-web/services/current-user';
import InternalUserModel from 'ember-osf-web/models/internal-user';
import InternalResourceModel from 'ember-osf-web/models/internal-resource';
import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import AuthorizedStorageAccountModel from 'ember-osf-web/models/authorized-storage-account';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';

export default class Provider {
    @tracked node: NodeModel;
    @tracked serviceNode?: InternalResourceModel;

    currentUser: CurrentUserService;
    @tracked internalUser!: InternalUserModel;
    provider: ExternalStorageServiceModel;

    @tracked configuredStorageAddon?: ConfiguredStorageAddonModel;
    @tracked authorizedStorageAccount?: AuthorizedStorageAccountModel;


    @service store!: Store;

    constructor(provider: any, currentUser: CurrentUserService, node: NodeModel) {
        setOwner(this, getOwner(node));
        this.node = node;
        this.currentUser = currentUser;
        this.provider = provider;
        taskFor(this.initialize).perform();
    }

    @task
    @waitFor
    async initialize() {
        await taskFor(this.getInternalUser).perform();
        await taskFor(this.getInternalResource).perform();
        await taskFor(this.getConfiguredStorageAddon).perform();
    }

    @task
    @waitFor
    async getInternalUser() {
        this.internalUser = await this.store.findRecord('internal-user', this.currentUser.user?.id);
    }

    @task
    @waitFor
    async getInternalResource() {
        this.serviceNode = await this.store.findRecord('internal-resource', this.node.id);
    }

    @task
    @waitFor
    async getConfiguredStorageAddon() {
        if (this.serviceNode) {
            const configuredStorageAddons = await this.serviceNode.configuredStorageAddons;
            configuredStorageAddons.forEach(async (configuredAddon: ConfiguredStorageAddonModel) => {
                const storageProvider = await configuredAddon.get('storageProvider');
                if (storageProvider.id === this.provider.id) {
                    this.configuredStorageAddon = configuredAddon;
                }
            });
        }
    }

    async userAddonAccounts() {
        return await this.internalUser.authorizedStorageAccounts;
    }

    @task
    @waitFor
    async createAccountForNodeAddon() {
        const account = this.store.createRecord('authorized-storage-account', {
            externalUserId: this.currentUser.user?.id,
            scopes: [],
            defaultRootFolder: '',
            storageProvider: this.provider,
            configuringUser: this.internalUser,
        });
        await account.save();
        return account;
    }

    @task
    @waitFor
    async setNodeAddonCredentials(account: AuthorizedStorageAccountModel) {
        if (this.configuredStorageAddon) {
            this.configuredStorageAddon.set('baseAccount', account);
        }
    }

    @task
    @waitFor
    async disableProjectAddon() {
        if (this.configuredStorageAddon) {
            await this.configuredStorageAddon.destroyRecord();
            this.configuredStorageAddon = undefined;
        }
    }

    listOfFolders() {
        // TODO
        return;
    }

    @task
    @waitFor
    async setRootFolder(newRootFolder: string) {
        if (this.configuredStorageAddon) {
            this.configuredStorageAddon.rootFolder = newRootFolder;
            await this.configuredStorageAddon.save();
        }
    }
}
