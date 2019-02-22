import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import UserModel from 'ember-osf-web/models/user';
import RSVP from 'rsvp';
import ModelRegistry from 'ember-data/types/registries/model';

export default class Addon extends Component {
    @service store!: DS.Store;

    addon!: object;
    user!: UserModel;
    account!: object;
    modalOpen: boolean = false;

    @action
    openDeleteModal() {
        this.set('modalOpen', true);
    }

    @action
    closeDeleteModal() {
        this.set('modalOpen', false);
    }

    deleteModel = async (name: string & keyof ModelRegistry, id: string) => {
        const { store } = this;
        const model = await store.findRecord(
            name,
            id,
            { backgroundReload: false },
        );

        await model.destroyRecord();
        return store.unloadRecord(model);
    }

    @action
    async deleteAccount(id: string, userAddonId: string) {
        const { deleteModel } = this;
        const userAddon = deleteModel('user-addon', userAddonId);
        const account = deleteModel('account', id);

        await RSVP.all([userAddon, account]);

        this.set('modalOpen', false);
    }
}
