import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokenCreateController extends Controller {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    @action
    onSave(token: Token) {
        this.toast.success(this.intl.t('settings.tokens.created'));
        this.router.transitionTo('settings.tokens.edit', token.id);
    }
}
