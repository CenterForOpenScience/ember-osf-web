import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class SettingsController extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;

    navCollapsed = true;
}
