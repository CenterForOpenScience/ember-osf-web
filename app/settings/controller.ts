import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Media from 'ember-responsive';
import { tracked } from 'tracked-built-ins';

export default class SettingsController extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service media!: Media;

    @tracked navCollapsed = true;

    get shouldShowNavLinks() {
        if (this.media.isMobile || this.media.isTablet){
            return !this.navCollapsed;
        }
        return true;
    }
}
