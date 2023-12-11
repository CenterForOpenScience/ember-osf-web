import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';

import NodeModel from 'ember-osf-web/models/node';
import CurrentUserService from 'ember-osf-web/services/current-user';
import InternalUserModel from 'ember-osf-web/models/internal-user';

export default class Provider {
    @tracked node: NodeModel;
    currentUser: CurrentUserService;
    internalUser!: InternalUserModel;
    provider: any; // TODO: Fix this

    @service store!: Store;

    constructor(provider: any, currentUser: CurrentUserService, node: NodeModel) {
        setOwner(this, getOwner(node));
        this.node = node;
        this.currentUser = currentUser;
        this.getInternalUser();
        this.provider = provider;
    }

    async getInternalUser() {
        this.internalUser = await this.store.findRecord('internal-user', this.currentUser.user?.id);
    }

    async userAddonAccounts() {
        return await this.internalUser.authorizedStorageAccounts;
    }

    createAccountForNodeAddon() {
        return;
    }

    disableProjectAddon() {
        return;
    }

    listOfFolders() {
        return;
    }

    setNodeAddonCredentials() {
        return;
    }

    setRootFolder() {
        return;
    }
}
