import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsApplicationCreateController extends Controller {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    @action
    onSave(developerApp: DeveloperApp) {
        this.toast.success(this.intl.t('settings.developer-apps.created'));
        this.router.transitionTo('settings.developer-apps.edit', developerApp.id);
    }
}
