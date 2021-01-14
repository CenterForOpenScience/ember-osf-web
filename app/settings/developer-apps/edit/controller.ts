import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsDeveloperAppsEditController extends Controller {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    @reads('model.taskInstance.value')
    developerApp?: DeveloperApp;
}
