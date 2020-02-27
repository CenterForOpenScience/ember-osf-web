import Controller from '@ember/controller';
import { action } from '@ember/object';
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

    @action
    appSaved() {
        // Analytics handled by validated-model-form
        this.toast.success(this.intl.t('settings.developer-apps.saved'));
        this.router.transitionTo('settings.developer-apps');
    }

    @action
    async deleteApp() {
        // Analytics and errors handled by delete-button
        if (this.developerApp) {
            await this.developerApp.destroyRecord();
            this.toast.success(this.intl.t('settings.developer-apps.deleted'));
        }

        this.router.transitionTo('settings.developer-apps');
    }
}
