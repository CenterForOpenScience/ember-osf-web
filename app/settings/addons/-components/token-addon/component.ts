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

export default class TokenAddon extends Component {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    addon!: Addon;
    userAddon!: string;
    modalOpen = false;
    userAddonAction = bindEmberStore(getUserAddon, this.store);

    openModal = () => {
        this.set('modalOpen', true);
    }

    closeModal = () => {
        this.set('modalOpen', false);
    }

    onSave = async (account: Account) => {
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
