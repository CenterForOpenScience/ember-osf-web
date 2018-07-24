import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsController extends Controller {
    @service analytics!: Analytics;

    navCollapsed: boolean = true;
}
