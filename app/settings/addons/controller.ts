import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import CurrentUser from 'ember-osf-web/services/current-user';
import {
    getAllUserAddons,
    getAppAddons,
} from 'ember-osf-web/settings/addons/services/addonService';

export default class SettingsAddonController extends Controller {
    models!: object;
    @service currentUser!: CurrentUser;

    init() {
        const { currentUser } = this;
        const id = currentUser.currentUserId;

        if (!id) {
            return;
        }

        const models = {
            addons: getAppAddons(this.store),
            user: getAllUserAddons(this.store, id),
        };

        this.set('models', models);
    }
}
