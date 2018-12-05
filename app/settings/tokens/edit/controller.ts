import { action } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Intl from '@ember-intl/services/intl';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokensEditController extends Controller {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;

    deleteModalShown: boolean = false;

    @readOnly('model.taskInstance.value')
    token?: Token;

    @action
    tokenSaved() {
        // Analytics handled by `settings/tokens/-components/token-form`
        this.toast.success(this.intl.t('settings.tokens.saved'));
        this.router.transitionTo('settings.tokens');
    }

    @action
    async deleteToken() {
        // Analytics handled by delete-button
        await this.token!.destroyRecord();

        this.toast.success(this.intl.t('settings.tokens.deleted'));
        this.router.transitionTo('settings.tokens');
    }

    @action
    refresh() {
        this.clearTokenValue();

        // Send action to route
        this.send('refreshRoute');
    }

    clearTokenValue() {
        if (this.token && this.token.tokenValue) {
            this.token.unloadRecord();
        }
    }
}
