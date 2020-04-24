import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
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
        this.router.transitionTo('settings.tokens.edit', token.get('id'));
    }
}
