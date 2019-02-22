import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Account from 'ember-osf-web/models/account';
import Addon from 'ember-osf-web/models/addon';
import DS from 'ember-data';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class TokenAddon extends Component {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    addon!: Addon;
    userAddon!: string;
    modalOpen = false;

    openModal = () => {
        this.set('modalOpen', true);
    }

    closeModal = () => {
        this.set('modalOpen', false);
    }

    onSave = async (account: Account) => {
        const { store, currentUser, addon  } = this;
        const { user } = currentUser;

        if(!user) {
            return;
        }

        let userAddon = store.peekRecord('user-addon', addon.id);
        if(!userAddon) {
            userAddon = store.createRecord('user-addon', {
                id: addon.id,
                userHasAuth: true,
                user,
                account,
            });
        }

        // userAddon.set('account', account);
        account.setProperties({
            addon: userAddon,
            provider: addon.id,
            displayName: user.fullName,
        });

        await userAddon.save();
        await account.save();
    }
}
