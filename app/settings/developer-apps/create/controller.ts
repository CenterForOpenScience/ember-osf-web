import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import { ChangesetDef } from 'ember-changeset/types';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsApplicationCreateController extends Controller {
    @service analytics!: Analytics;
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    @action
    onSave(developerApp: DeveloperApp & ChangesetDef) {
        this.toast.success(this.i18n.t('settings.developer-apps.created'));
        this.router.transitionTo('settings.developer-apps.edit', developerApp.get('id'));
    }
}
