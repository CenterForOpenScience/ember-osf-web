import { action } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';

export default class SettingsTokensEditController extends Controller {
    @service analytics!: Analytics;
    @service router: any;

    deleteModalShown: boolean = false;

    @readOnly('model.taskInstance.value')
    token?: Token;

    @action
    tokenSaved() {
        // Analytics handled by x-token-form
        this.router.transitionTo('osf.settings.tokens');
    }

    @action
    async deleteToken() {
        // Analytics handled by delete-button
        await this.token!.destroyRecord();

        this.router.transitionTo('osf.settings.tokens');
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
