import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import UserModel from 'ember-osf-web/models/user';

export default class Addon extends Component {
    addon!: object;
    user!: UserModel;
    account!: object;
    @service store!: DS.Store;

    modalOpen: boolean = false;

    @action
    openDeleteModal() {
        this.set('modalOpen', true);
    }

    @action
    closeDeleteModal() {
        this.set('modalOpen', false);
    }

    @action
    async deleteAccount(id: string, userAddonId: string) {
        const userAddon = await this.store.findRecord(
            'user-addon',
            userAddonId,
            { backgroundReload: false },
        );
        const account = await this.store.findRecord(
            'account',
            id,
            { backgroundReload: false },
        );

        userAddon.deleteRecord();
        account.deleteRecord();

        await account.save();
        await userAddon.save();

        const userAddons = await this.user.get('addons');
        userAddons.removeObject(userAddon);

        await this.user.save();
        this.set('modalOpen', false);
    }
}
