import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import UserModel from 'ember-osf-web/models/user';
import RSVP from 'rsvp';
import {
    bindEmberStore,
    deleteUserAddon,
    deleteAccount,
} from 'ember-osf-web/settings/addons/services/addonService';

export default class Addon extends Component {
    @service store!: DS.Store;

    addon!: object;
    user!: UserModel;
    account!: object;
    modalOpen: boolean = false;
    deleteUserAddonAction = bindEmberStore(deleteUserAddon, this.store);
    deleteAccountAction = bindEmberStore(deleteAccount, this.store);

    @action
    openDeleteModal() {
        this.set('modalOpen', true);
    }

    @action
    closeDeleteModal() {
        this.set('modalOpen', false);
    }

    @action
    async deleteAccount(accountID: string, userAddonID: string) {
        const {
            deleteUserAddonAction,
            deleteAccountAction,
        } = this;

        await RSVP.all([
            deleteAccountAction(accountID),
            deleteUserAddonAction(userAddonID)
        ]);

        this.set('modalOpen', false);
    }
}
