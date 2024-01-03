import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { task } from 'ember-concurrency';
import { tracked } from 'tracked-built-ins';

import AddonModel from 'ember-osf-web/models/addon';
import ExternalAccountsModel from 'ember-osf-web/models/external-account';
import NodeModel from 'ember-osf-web/models/node';
import NodeAddonModel from 'ember-osf-web/models/node-addon';
import UserAddonModel from 'ember-osf-web/models/user-addon';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { taskFor } from 'ember-concurrency-ts';

export default class LegacyProvider {
    provider: AddonModel;
    currentUser: CurrentUserService;
    node: NodeModel;

    userAddon?: UserAddonModel;
    @tracked nodeAddon?: NodeAddonModel;
    externalAccounts?: ExternalAccountsModel[];

    @service store!: Store;


    constructor(provider: AddonModel, currentUser: CurrentUserService, node: NodeModel) {
        setOwner(this, getOwner(currentUser));
        this.currentUser = currentUser;
        this.node = node;
        this.provider = provider;
    }

    @task
    @waitFor
    async userAddonAccounts(){
        if (this.userAddon){
            this.externalAccounts = (await this.userAddon.externalAccounts).toArray();
            return this.externalAccounts;
        }
        if (this.currentUser.user){
            const userAddons = await this.currentUser.user.queryHasMany(
                'userAddons',
                {filter: {addon: this.provider.name}},
            ) as unknown as UserAddonModel[];
            if (userAddons.length > 0){
                const userAddon = userAddons[0];
                this.userAddon = userAddon;
                const externalAccounts = await userAddon.externalAccounts;
                this.externalAccounts = externalAccounts.toArray();
                return this.externalAccounts;
            }
        }
        this.externalAccounts = [];
        return [];
    }

    @task
    @waitFor
    async createAccountForNodeAddon() {
        const nodeAddon = this.store.createRecord('node-addon', {
            node: this.node,
            provider: this.provider,
        });
        await nodeAddon.save();
        this.nodeAddon = nodeAddon;
        return undefined;
    }

    @task
    @waitFor
    async setNodeAddonCredentials(externalAccount: ExternalAccountsModel) {
        await taskFor(this._cacheNodeAddonIfNecessary).perform();
        if (this.nodeAddon) {
            this.nodeAddon.set('externalAccount', externalAccount);
            await this.nodeAddon.save();
        } else {
            throw new Error('No node-addon to set');
        }
        return undefined;
    }

    @task
    @waitFor
    async disableProjectAddon() {
        await taskFor(this._cacheNodeAddonIfNecessary).perform();
        if (this.nodeAddon) {
            this.nodeAddon.deleteRecord();
            await this.nodeAddon.save();
            this.nodeAddon = undefined;
        } else {
            throw new Error('No node-addon to disable');
        }
        return undefined;
    }

    listOfFolders() {
        return;
    }

    @task
    @waitFor
    async setRootFolder(rootFolder: string) {
        await taskFor(this._cacheNodeAddonIfNecessary).perform();
        if (this.nodeAddon) {
            this.nodeAddon.set('folderPath', rootFolder);
            await this.nodeAddon.save();
        } else {
            throw new Error('No node-addon to set');
        }

        return undefined;
    }

    @task
    @waitFor
    async _cacheNodeAddonIfNecessary() {
        if (!this.nodeAddon) {
            const nodeAddons = (await this.node.queryHasMany(
                'nodeAddons',
                {filter: {id: this.provider.name}},
            )).toArray();
            if (nodeAddons.length > 0) {
                this.nodeAddon = nodeAddons[0];
            }
        }
        return undefined;
    }
}
