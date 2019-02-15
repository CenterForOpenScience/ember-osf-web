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

    init() {
        const models = {
            addons: this.store.query('addon', {}),
            user: this.getCurrentUser(),
        };

        this.set('models', models);
    }
}
