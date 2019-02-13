import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import CurrentUser from 'ember-osf-web/services/current-user';

export default class SettingsAddonController extends Controller {
    models!: object;
    @service currentUser!: CurrentUser;

    getCurrentUser() {
        const { currentUserId } = this.currentUser;
        return currentUserId ? this.store.peekRecord('user', currentUserId) : null;
    }

    loadUserAddons() {
        const user = this.getCurrentUser();
        return user ?
            user.queryHasMany('addons').then(addons => {
                addons.map(addon => {
                    addon.get('accounts');
                });
                return addons;
            }) : {};
    }

    init() {
        const models = {
            addons: this.store.query('addon', {}),
            userAddons: this.loadUserAddons(),
        };

        this.set('models', models);
    }
}
