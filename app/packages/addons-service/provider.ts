import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';

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
    internalUser!: InternalUserModel;
    provider: ExternalStorageServiceModel;

    configuredStorageAddon?: ConfiguredStorageAddonModel;
    authorizedStorageAccount?: AuthorizedStorageAccountModel;


    @service store!: Store;

    constructor(provider: any, currentUser: CurrentUserService, node: NodeModel) {
        setOwner(this, getOwner(node));
        this.node = node;
        this.currentUser = currentUser;
        this.getInternalUser();
        this.getInternalResource();
        this.getConfiguredStorageAddon();
        this.provider = provider;
    }

    async getInternalUser() {
        this.internalUser = await this.store.findRecord('internal-user', this.currentUser.user?.id);
    }

    async getInternalResource() {
        this.serviceNode = await this.store.findRecord('internal-resource', this.node.id);
    }

    async getConfiguredStorageAddon() {
        if (this.serviceNode) {
            const configuredStorageAddons = await this.serviceNode.get('configuredStorageAddons');
            configuredStorageAddons.forEach((configuredAddon: ConfiguredStorageAddonModel) => {
                if (configuredAddon.storageProvider.id === this.provider.id) {
                    this.configuredStorageAddon = configuredAddon;
                }
            });
        }
    }

    async userAddonAccounts() {
        return await this.internalUser.authorizedStorageAccounts;
    }

    async createAccountForNodeAddon() {
        const account = this.store.createRecord('authorized-storage-account', {
            externalUserId: this.currentUser.user?.id,
            externalUserDisplayName: this.currentUser.user?.fullName,
            scopes: [],
            defaultRootFolder: '',
            storageProvider: this.provider,
            configuringUser: this.internalUser,
        });
        await account.save();
    }

    async disableProjectAddon() {
        if (this.configuredStorageAddon) {
            await this.configuredStorageAddon.destroyRecord();
        }
    }

    listOfFolders() {
        // TODO
        return;
    }

    setNodeAddonCredentials(account: AuthorizedStorageAccountModel) {
        if (this.configuredStorageAddon) {
            this.configuredStorageAddon.set('baseAccount', account);
        }
    }

    async setRootFolder(newRootFolder: string) {
        if (this.configuredStorageAddon) {
            this.configuredStorageAddon.set('rootFolder', newRootFolder);
            await this.configuredStorageAddon.save();
        }
    }
}
