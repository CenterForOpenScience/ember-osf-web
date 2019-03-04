import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class SettingsController extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;

    navCollapsed: boolean = true;
}
