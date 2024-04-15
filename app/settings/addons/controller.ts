import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import CurrentUser from 'ember-osf-web/services/current-user';

export default class SettingsAddonsController extends Controller {
    @service currentUser!: CurrentUser;
    @service media!: Media;

    get isMobile(): boolean {
        return this.media.isMobile;
    }
}
