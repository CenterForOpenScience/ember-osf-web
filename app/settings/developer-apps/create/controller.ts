import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { ChangesetDef } from 'ember-changeset/types';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import DeveloperApp from 'ember-osf-web/models/developer-app';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsApplicationCreateController extends Controller {
    @service analytics!: Analytics;

    @service intl!: Intl;

    @service router!: RouterService;

    @service toast!: Toast;

    @action
    onSave(developerApp: DeveloperApp & ChangesetDef) {
        this.toast.success(this.intl.t('settings.developer-apps.created'));
        this.router.transitionTo('settings.developer-apps.edit', developerApp.get('id'));
    }
}
