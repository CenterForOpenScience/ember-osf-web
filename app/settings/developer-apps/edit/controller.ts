import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsDeveloperAppsEditController extends Controller {
    @service analytics!: Analytics;
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    @reads('model.taskInstance.value')
    developerApp?: DeveloperApp;

    @action
    appSaved() {
        // Analytics handled by validated-model-form
        this.toast.success(this.i18n.t('settings.developer-apps.saved'));
        this.router.transitionTo('settings.developer-apps');
    }

    @action
    async deleteApp() {
        // Analytics and errors handled by delete-button
        if (this.developerApp) {
            await this.developerApp.destroyRecord();
            this.toast.success(this.i18n.t('settings.developer-apps.deleted'));
        }

        this.router.transitionTo('settings.developer-apps');
    }
}
