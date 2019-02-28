import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Account from 'ember-osf-web/models/account';
import Addon from 'ember-osf-web/models/addon';
import DS from 'ember-data';
import CurrentUser from 'ember-osf-web/services/current-user';
import {
    getUserAddon,
    getUserAccount,
    addNewUserAccount,
    bindEmberStore ,
} from 'ember-osf-web/settings/addons/services/addonService';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    username: validator('presence', true),
    password: validator('presence', true),
});

export default class CredentialAddon extends Component.extend(Validations, {
    username: null,
    password: null,
}) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    userAddonAction = bindEmberStore(getUserAddon, this.store);

    addon!: Addon;
    modalOpen = false;

    @action
    openModal() {
        this.setProperties({
            modalOpen: true,
            username: '',
            password: '',
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

        if(!user) {
            return;
        }

        const userAddon = await userAddonAction(addon.id, user);
        const userAccount = await getUserAccount(userAddon) || account;
        const data = {
            userAddon,
            providerId: addon.id,
            displayName: user.fullName,
        };

        await addNewUserAccount(userAccount, data);
        this.set('modalOpen', false);
    }
}
