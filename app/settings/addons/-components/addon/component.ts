import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import UserModel from 'ember-osf-web/models/user';
import {
    bindEmberStore,
    deleteAccount,
    deleteUserAddon,
} from 'ember-osf-web/settings/addons/services/addonService';
import RSVP from 'rsvp';

export default class Addon extends Component {
    @service store!: DS.Store;

    addon!: object;
    user!: UserModel;
    account!: object;
    modalOpen: boolean = false;
    deleteUserAddonAction = bindEmberStore(deleteUserAddon, this.store);
    deleteAccountAction = bindEmberStore(deleteAccount, this.store);
    addonLoading!: boolean;

    @action
    openDeleteModal() {
        this.setProperties({
            modalOpen: true,
            addonLoading: false,
        });
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

        this.set('addonLoading', true);

        await RSVP.all([
            deleteAccountAction(accountID),
            deleteUserAddonAction(userAddonID),
        ]);
        this.set('modalOpen', false);
    }
}
