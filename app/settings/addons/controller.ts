import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import {
    getAppAddons,
    getAllUserAddons,
} from 'ember-osf-web/settings/addons/services/addonService';

import CurrentUser from 'ember-osf-web/services/current-user';

export default class SettingsAddonController extends Controller {
    models!: object;
    @service currentUser!: CurrentUser;

    init() {
        const { currentUser } = this;
        const id = currentUser.currentUserId || '';
        const models = {
            addons: getAppAddons(this.store),
            user: getAllUserAddons(this.store, id),
        };

        this.set('models', models);
    }
}
