import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import Account from 'ember-osf-web/models/account';
import Addon from 'ember-osf-web/models/addon';
import CurrentUser from 'ember-osf-web/services/current-user';
import {
    addNewUserAccount,
    bindEmberStore,
    getUserAccount,
    getUserAddon,
} from 'ember-osf-web/settings/addons/services/addonService';

const Validations = buildValidations({
    apiToken: validator('presence', true),
});

export default class TokenAddon extends Component.extend(Validations, {
    apiToken: null,
}) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    userAddonAction = bindEmberStore(getUserAddon, this.store);

    addon!: Addon;
    modalOpen!: boolean;
    addonLoading!: boolean;

    @action
    openModal() {
        this.setProperties({
            modalOpen: true,
            addonLoading: false,
            apiToken: '',
        });
    }

    @action
    closeModal() {
        this.set('modalOpen', false);
    }

    @action
    async onSave(account: Account) {
        const { currentUser, addon, userAddonAction } = this;
        const { user } = currentUser;
        const userAddon = await userAddonAction(addon.id, user);
        const userAccount = await getUserAccount(userAddon) || account;
        const data = {
            userAddon,
            providerId: addon.id,
            displayName: user ? user.fullName : '',
        };

        this.set('addonLoading', true);
        await addNewUserAccount(userAccount, data);
        this.set('modalOpen', false);
    }
}
