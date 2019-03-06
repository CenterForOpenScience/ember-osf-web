import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import CurrentUser from 'ember-osf-web/services/current-user';
import { getAllUserAddons, getAppAddons } from './services/addonService';

export default class SettingsAddonRoute extends Route {
    @service currentUser!: CurrentUser;

    model() {
        const { currentUser } = this;
        const id = currentUser.currentUserId;

        if (!id) {
            return;
        }

        return {
            addons: getAppAddons(this.store),
            user: getAllUserAddons(this.store, id),
        };
    }
}
