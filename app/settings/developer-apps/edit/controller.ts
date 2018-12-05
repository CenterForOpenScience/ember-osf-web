import { action } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsDeveloperAppsEditController extends Controller {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    @readOnly('model.taskInstance.value')
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
