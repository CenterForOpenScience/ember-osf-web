import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import CurrentUser from 'ember-osf-web/services/current-user';

export default class SettingsAddonController extends Controller {
    models!: object;
    @service currentUser!: CurrentUser;

    getCurrentUser() {
        const { currentUserId } = this.currentUser;
        return currentUserId ? this.store.findRecord('user', currentUserId) : null;
    }

    loadUser() {
        const { currentUserId } = this.currentUser;
        // const user = this.getCurrentUser();
        if(!currentUserId) {
            return null;
        }

        return this.store.findRecord(
            'user',
            currentUserId,
            { embed: 'addons addons.accounts' }).then((data) => {
                return data;
            });

        // return user ?
            // user.queryHasMany('addons', { embed: 'accounts' })
            // : {};

    }

    init() {
        const models = {
            addons: this.store.query('addon', {}),
            user: this.loadUser(),
        };

        this.set('models', models);
    }
}
