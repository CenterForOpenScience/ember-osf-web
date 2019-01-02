import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokensEditController extends Controller {
    @service analytics!: Analytics;
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    deleteModalShown: boolean = false;

    @reads('model.taskInstance.value')
    token?: Token;

    @action
    tokenSaved() {
        // Analytics handled by `settings/tokens/-components/token-form`
        this.toast.success(this.i18n.t('settings.tokens.saved'));
        this.router.transitionTo('settings.tokens');
    }

    @action
    async deleteToken() {
        // Analytics handled by delete-button
        await this.token!.destroyRecord();

        this.toast.success(this.i18n.t('settings.tokens.deleted'));
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
