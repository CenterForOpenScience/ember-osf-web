import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokenCreateController extends Controller {
    @service analytics!: Analytics;
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    @action
    onSave(token: Token) {
        this.toast.success(this.i18n.t('settings.tokens.created'));
        this.router.transitionTo('settings.tokens.edit', token.get('id'));
    }
}
