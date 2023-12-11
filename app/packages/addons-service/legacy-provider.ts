import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

import AddonModel from 'ember-osf-web/models/addon';
import ExternalAccountsModel from 'ember-osf-web/models/external-accounts';
import NodeModel from 'ember-osf-web/models/node';
import NodeAddonModel from 'ember-osf-web/models/node-addon';
import UserAddonModel from 'ember-osf-web/models/user-addon';
import CurrentUserService from 'ember-osf-web/services/current-user';

export default class LegacyProvider {
    provider: AddonModel;
    currentUser: CurrentUserService;
    node: NodeModel;

    userAddon?: UserAddonModel;
    nodeAddon?: NodeAddonModel;
    externalAccounts?: ExternalAccountsModel[];

    @service store!: Store;


    constructor(provider: AddonModel, currentUser: CurrentUserService, node: NodeModel) {
        this.currentUser = currentUser;
        this.node = node;
        this.provider = provider;
    }

    async userAddonAccounts(){
        if (this.userAddon){
            this.externalAccounts = (await this.userAddon.externalAccounts).toArray();
            return this.externalAccounts;
        }
        if (this.currentUser.user){
            const userAddons = await this.currentUser.user.queryHasMany(
                'userAddons',
                {'filter[provider]': this.provider.name},
            ) as unknown as UserAddonModel[];
            if (userAddons.length > 0){
                const userAddon = userAddons[0];
                this.userAddon = userAddon;
                this.externalAccounts = (await userAddon.externalAccounts).toArray();
                return this.externalAccounts;
            }
        }
        this.externalAccounts = [];
        return [];
    }

    async createAccountForNodeAddon() {
        this.nodeAddon = this.store.createRecord('node-addon', {
            node: this.node,
            provider: this.provider,
        });
        await this.nodeAddon?.save();
    }

    async setNodeAddonCredentials(externalAccount: ExternalAccountsModel) {
        if (!this.nodeAddon) {
            this.nodeAddon = await this.node.queryHasMany(
                'nodeAddons',
                {'filter[provider]': this.provider.name},
            ) as unknown as NodeAddonModel;
        }
        this.nodeAddon.set('externalAccount', externalAccount);
        await this.nodeAddon.save();

        return undefined;
    }

    async disableProjectAddon() {
        if (!this.nodeAddon) {
            this.nodeAddon = await this.node.queryHasMany(
                'nodeAddons',
                {'filter[provider]': this.provider.name},
            ) as unknown as NodeAddonModel;
        }
        this.nodeAddon.deleteRecord();
        await this.nodeAddon.save();

        return undefined;
    }

    listOfFolders() {
        return;
    }

    async setRootFolder(rootFolder: string) {
        if (!this.nodeAddon) {
            this.nodeAddon = await this.node.queryHasMany(
                'nodeAddons',
                {'filter[provider]': this.provider.name},
            ) as unknown as NodeAddonModel;
        }
        this.nodeAddon.set('folderPath', rootFolder);
        await this.nodeAddon.save();

        return undefined;
    }

}
